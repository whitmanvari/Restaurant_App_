using Restaurant_App.WebAPI.Dto;
using Restaurant_App.WebAPI.Validators.Abstract;
using Restaurant_App.WebAPI.ViewModels.Concrete;

namespace Restaurant_App.WebAPI.Validators.Concrete
{
    public class UserRegisterValidator : BaseValidator<UserRegisterViewModel, UserRegisterDTO>
    {
        public UserRegisterValidator()
        {
        }
    }
}
