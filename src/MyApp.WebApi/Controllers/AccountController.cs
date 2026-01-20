using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MyApp.Application.Dtos;
using MyApp.Application.Interfaces;

namespace MyApp.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IAccountRepository _accountRepository;
        private readonly ILogger<AccountController> _logger;
        public AccountController(IAccountRepository accountRepository, ILogger<AccountController> logger)
        {
            _accountRepository = accountRepository;
            _logger = logger;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserDto user)
        {
            try
            {
                await _accountRepository.Register(user);
                return Ok("User registered successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while registering user");
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while registering the user");
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto user)
        {
            try
            {
                var authResponse = await _accountRepository.Login(user);
                return Ok(authResponse);
            }
            catch (UnauthorizedAccessException ex)
            {
                _logger.LogWarning(ex, "User failed to log in due to invalid credentials.");
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while logging in user");
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An unexpected error occurred while logging in." });
            }
        }

        [HttpPost("loginWithGoogle")]
        public async Task<IActionResult> LoginWithGoogle([FromBody] ExternalLoginDto dto)
        {
            try
            {
                if (dto != null)
                {
                    var authResponse = await _accountRepository.LoginWithGoogle(dto);
                    return Ok(authResponse);
                }
                else
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while logging in with Google");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while logging in with Google");
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while logging in with Google");
            }
        }

        [HttpPost("loginWithFacebook")]
        public async Task<IActionResult> LoginWithFacebook([FromBody] FacebookLoginDto dto)
        {
            try
            {
                if (dto != null)
                {
                    var authResponse = await _accountRepository.LoginWithFacbook(dto);
                    return Ok(authResponse);
                }
                else
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while logging in with Facebook");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while logging in with Facebook");
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while logging in with Facebook");
            }
        }

        [HttpGet("GetUsersnames")]
        public async Task<IActionResult> GetUsersNames()
        {
            try
            {
                var usernames = await _accountRepository.GetAllUsersnames();
                return Ok(usernames);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while retrieving usernames");
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while retrieving usernames");
            }
        }
    }
}
