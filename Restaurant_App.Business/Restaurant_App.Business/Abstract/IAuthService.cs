
using Restaurant_App.Entities.Dto;

namespace Restaurant_App.Business.Abstract
{
    public interface IAuthService
    {
        Task<bool> Register(UserRegisterDTO model);
        Task<string?> Login(UserLoginDTO model); //Başarılıysa token döner.
    }
}
