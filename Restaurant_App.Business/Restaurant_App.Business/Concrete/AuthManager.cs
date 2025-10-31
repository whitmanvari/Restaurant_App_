using Microsoft.AspNetCore.Identity;
using Restaurant_App.Business.Abstract;
using Restaurant_App.Business.Identity;
using Restaurant_App.Entities.Dto;


namespace Restaurant_App.Business.Concrete
{
    public class AuthManager : IAuthService
    {
        private readonly UserManager<ApplicationUser>? _userManager;
        private readonly SignInManager<ApplicationUser>? _signInManager;
        public Task<string?> Login(UserLoginDTO model)
        {
            throw new NotImplementedException();
        }

        public Task<bool> Register(UserRegisterDTO model)
        {
            throw new NotImplementedException();
        }
    }
}
