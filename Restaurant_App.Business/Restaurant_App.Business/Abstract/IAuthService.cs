
namespace Restaurant_App.Business.Abstract
{
    public interface IAuthService
    {
        Task<bool> Register(UserRegisterDTO model);
    }
}
