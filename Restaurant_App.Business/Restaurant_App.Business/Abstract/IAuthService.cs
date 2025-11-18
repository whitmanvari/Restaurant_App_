using Microsoft.AspNetCore.Identity;
using Restaurant_App.Application.Dto;

namespace Restaurant_App.Business.Abstract
{
    public interface IAuthService
    {
        Task<IdentityResult> Register(UserRegisterDTO model);
        Task<string?> Login(UserLoginDTO model); //Başarılıysa token döner.
    }
}
