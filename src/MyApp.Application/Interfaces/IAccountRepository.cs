using MyApp.Application.Dtos;
using MyApp.Domain.Entities;
using MyApp.Domain.Entities.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyApp.Application.Interfaces
{
    public interface IAccountRepository 
    {
        Task Register(UserDto user);
        Task<UserAuth> Login(LoginDto user);
        Task<UserAuth> LoginWithFacbook(FacebookLoginDto dto);
        Task<UserAuth> LoginWithGoogle(ExternalLoginDto dto);
        Task<UserAuth> LoginWithLinkedIn(ExternalLoginDto dto);
        Task Logout(string userId);
        Task <List<string>> GetAllUsersnames();

    }
}
