using Restaurant_App.Application.Validators.Abstract;
using Restaurant_App.Application.Dto;

namespace Restaurant_App.Application.Validators.Concrete
{
    public class UserLoginValidator: BaseValidator<UserLoginDTO>
    {
        public UserLoginValidator()
        {
            MustBeValidEmail(x => x.Email);
            NotEmptyString(x => x.Password, "Şifre zorunludur.", 15);
        }
    }
}
