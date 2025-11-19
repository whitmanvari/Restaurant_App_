using Microsoft.AspNetCore.Identity;
using Restaurant_App.Application.Dto;

namespace Restaurant_App.Business.Abstract
{
    public interface IAuthService
    {
        Task<IdentityResult> Register(UserRegisterDTO model);
        Task<string?> Login(UserLoginDTO model); //Başarılıysa token döner.
        Task<bool> UpdateUserProfile(string userId, UserUpdateDTO model);
        Task<UserUpdateDTO> GetUserProfile(string userId); // Profil verilerini çekmek için
    }
}
