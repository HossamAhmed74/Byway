using Azure.Core;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using MyApp.Application.Core.Models;
using MyApp.Application.Dtos;
using MyApp.Application.Interfaces;
using MyApp.Domain.Entities;
using MyApp.Domain.Entities.Identity;
using NLog;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace MyApp.Infrastructure.Data.Repositories
{
    public class AccountRepository :IAccountRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<AccountRepository> _logger;
        private readonly IConfiguration _configuration;
        private readonly IHttpClientFactory _clientFactory;

        public AccountRepository(
            ApplicationDbContext context,
            UserManager<ApplicationUser> userManager ,
            ILogger<AccountRepository> logger
            ,IConfiguration configuration,IHttpClientFactory clientFactory)
        {
            _context = context;
            _userManager = userManager;
            _logger = logger;
            _configuration = configuration;
            _clientFactory = clientFactory;
        }

        public async Task<UserAuth> Login(LoginDto user)
        {
            if (user == null)
            {
                _logger.LogError("User login failed: UserDto is null");
                throw new ArgumentNullException(nameof(user));
            }

            var applicationUser = await _userManager.FindByNameAsync(user.UserName)
                               ?? await _userManager.FindByEmailAsync(user.UserName);

            // Handle failure by throwing exceptions (preferred API design)
            if (applicationUser == null)
            {
                _logger.LogWarning("User login failed: Invalid username or password");
                throw new UnauthorizedAccessException("Invalid username or password.");
            }

            var result = await _userManager.CheckPasswordAsync(applicationUser, user.Password);
            if (!result)
            {
                _logger.LogWarning("User login failed: Invalid username or password");
                throw new UnauthorizedAccessException("Invalid username or password.");
            }

            var userAuth = await GenerateJwtToken(applicationUser);
            return userAuth;
        }

        private async Task<UserAuth> GenerateJwtToken(ApplicationUser applicationUser)
        {
            // --- JWT CLAIM GENERATION (Unchanged and correct) ---
            var claims = new List<Claim>();
            claims.Add(new Claim(ClaimTypes.Name, applicationUser.UserName ?? ""));
            claims.Add(new Claim(ClaimTypes.NameIdentifier, applicationUser.Id));
            claims.Add(new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()));

            var roles = await _userManager.GetRolesAsync(applicationUser);
            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            // --- TOKEN CREATION (Unchanged) ---
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:SecretKey"] ?? ""));
            var sc = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expiryTime = DateTime.UtcNow.AddHours(1);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                expires: expiryTime,
                claims: claims,
                signingCredentials: sc
            );

            // --- RETURN THE AuthResponseDto ---
            // Construct the DTO using the generated token and the username
            return new UserAuth
            {
                Token = new JwtSecurityTokenHandler().WriteToken(token),
                Username = applicationUser.UserName, 
                Expiration = expiryTime
            };
        }

        public  async Task<UserAuth> LoginWithFacbook(FacebookLoginDto dto)
        {
            var facebookAppId = _configuration["Authentication:Facebook:AppId"];
            var facebookAppSecret = _configuration["Authentication:Facebook:AppSecret"];

            // 1. Critical step: Validate the user's token on the server side
            // Get the App Access Token first (required to debug user token)
            var client = _clientFactory.CreateClient();

            // Construct the URL to debug/validate the user's access token
            // This validates if the token is valid, non-expired, and belongs to your app/user
            var debugTokenUrl =
                $"https://graph.facebook.com/debug_token?input_token={dto.AccessToken}&access_token={facebookAppId}|{facebookAppSecret}";

            var response = await client.GetAsync(debugTokenUrl);

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogError("Facebook token validation failed.");
            }

            var jsonString = await response.Content.ReadAsStringAsync();
            var validationResult = JsonSerializer.Deserialize<FacebookDebugTokenResponse>(jsonString);

            if (validationResult == null ||
                !validationResult.Data.IsValid ||
                validationResult.Data.AppId != facebookAppId ||
                validationResult.Data.UserId != dto.UserID)
            {
                _logger.LogError("Facebook token validation failed or user ID mismatch.");
            }

            // 2. Optional: Fetch user details (name, email) using the validated token
            var userDataUrl = $"https://graph.facebook.com/v18.0/me?fields=id,name,email&access_token={dto.AccessToken}";
            var userDataResponse = await client.GetAsync(userDataUrl);
            var userDataString = await userDataResponse.Content.ReadAsStringAsync();
            var userData = JsonSerializer.Deserialize<FacebookUserData>(userDataString);

            // 3. Authentication/Registration Logic (Simplified)
            // Check if user exists in your DB using userData.Id (Facebook ID)
            // If not, create a new user account
            // If yes, load existing user data

            // **In a real app, replace the simple ID with your application's user ID**
            var applicationUserId = userData.Id;
            var applicationUserName = userData.Name;
            var user = new ApplicationUser();

            var applicationUser = _context.Users.SingleOrDefault(u => u.Id == applicationUserId);
            if (applicationUser == null)
            {
                var newUser = new ApplicationUser
                {
                    FirstName = userData.Name.Split(' ').First(),
                    LastName = userData.Name.Split(' ').Last(),
                    UserName = $"{userData.Name.Split(' ').First()}_{userData.Name.Split(' ').Last()}_47".ToLowerInvariant(),
                    CreatedOn = DateTime.UtcNow,
                    LastModifiedOn = DateTime.UtcNow,
                    Email = userData.Email
                };
                var result = await _userManager.CreateAsync(newUser);
                if (!result.Succeeded)
                {
                    var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                    _logger.LogError("User creation failed: {Errors}", errors);
                    throw new Exception("Failed to create user account.");
                }
                user = newUser;
            }
            else
            {
               user = applicationUser;
            }

                // 4. Generate your application's JWT Token
                var userAuth = await GenerateJwtToken(user);

            return userAuth;
        }

        public async Task<UserAuth> LoginWithGoogle(ExternalLoginDto dto)
        {
            var googleClientId = _configuration["Authentication:Google:ClientId"];

            // 2. Setup Validation Settings (CRITICAL)
            var validationSettings = new GoogleJsonWebSignature.ValidationSettings()
            {
                Audience = new List<string> { googleClientId }
            };

            GoogleJsonWebSignature.Payload payload;
            try
            {
                // 3. Validate the Token (using 'dto.IdToken' instead of 'request.IdToken')
                payload = await GoogleJsonWebSignature.ValidateAsync(dto.IdToken, validationSettings);
            }
            catch (InvalidJwtException ex)
            {
                // 4. Handle Failure: In a service layer, it is best to throw an exception
                // that the calling API controller can catch and turn into a 401 response.
                throw new UnauthorizedAccessException("Invalid Google ID Token.", ex);
            }

            // 5. Extract User Data from the Payload
            string googleUserId = payload.Subject;
            string email = payload.Email;
            string firstName = payload.GivenName;
            string lastName = payload.FamilyName;

            // 6. Check if User Exists; If Not, Create a New User
            var userAuth = new UserAuth();
            var existingUser = _context.Users.SingleOrDefault(u => u.Email == email);
            if (existingUser != null) {
               var user =  await GenerateJwtToken(existingUser);
               userAuth = user;
            }
            else
            {
                var newUser = new ApplicationUser
                {
                    UserName = email,
                    Email = email,
                    FirstName = firstName,
                    LastName = lastName,
                };
                var result = await _userManager.CreateAsync(newUser);
                if (!result.Succeeded)
                {
                    var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                    _logger.LogError("User creation failed: {Errors}", errors);
                    throw new Exception("Failed to create user account.");
                }
                var user = await GenerateJwtToken(newUser);
                userAuth = user;
            }
            
            return userAuth;
        }

        public Task<UserAuth> LoginWithLinkedIn(ExternalLoginDto dto)
        {
            throw new NotImplementedException();
        }

        public Task Logout(string userId)
        {
            throw new NotImplementedException();
        }

        public async Task Register(UserDto user)
        {
            if (user == null)
            {
                _logger.LogError("User registration failed: UserDto is null");
                throw new ArgumentNullException(nameof(user));
            }

            bool emailExists = _context.Users.Any(u => u.Email == user.Email);
            if (emailExists)
            {
                _logger.LogError("This email already exists: {Email}", user.Email);
            }

            var applicationUser = new ApplicationUser
            {
                UserName = user.UserName,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,

            };
            IdentityResult result = await _userManager.CreateAsync(applicationUser, user.Password);
            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                _logger.LogError("User registration failed: {Errors}", errors);
            }
            else
            {
                _logger.LogInformation("User registered successfully: {Email}", user.Email);
            }
        }

        public async Task<List<string>> GetAllUsersnames()
        {
            var usernames = await _context.Users.Select(u => u.UserName ?? "").ToListAsync();
            return usernames;
        }
    }
}
