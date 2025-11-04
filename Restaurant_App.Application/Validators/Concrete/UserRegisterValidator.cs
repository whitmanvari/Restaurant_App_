using Restaurant_App.Application.Validators.Abstract;
using Restaurant_App.Application.Dto;
using FluentValidation;

namespace Restaurant_App.Application.Validators.Concrete
{
    public class UserRegisterValidator : BaseValidator<UserRegisterDTO>
    {
        public UserRegisterValidator()
        {
            NotEmptyString(x => x.FullName, "Ad Soyad zorunludur", 30);
            MustBeValidEmail(x => x.Email);
            NotEmptyString(x => x.Password, "Şifre zorunludur", 15);
            RuleFor(x => x.ConfirmPassword)
                .Equal(x => x.Password)
                    .WithMessage("Şifreler eşleşmiyor!");
        }
    }
}

