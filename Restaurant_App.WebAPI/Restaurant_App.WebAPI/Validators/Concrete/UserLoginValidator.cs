using FluentValidation;
using Restaurant_App.Entities.Dto;
using Restaurant_App.WebAPI.Validators.Abstract;
using Restaurant_App.WebAPI.ViewModels.Concrete;

namespace Restaurant_App.WebAPI.Validators.Concrete
{
    public class UserLoginValidator: BaseValidator<UserLoginViewModel, UserLoginDTO>
    {
        public UserLoginValidator()
        {
            ValidateWhenDataExists(() =>
            {
                RuleFor(x => x.Data!.Email)
                    .NotEmpty()
                        .WithMessage("E-posta boş olamaz!")
                    .EmailAddress()
                        .WithMessage("Geçerli bir e-posta adresi giriniz!");

                RuleFor(x => x.Data!.Password)
                    .NotEmpty()
                        .WithMessage("Şifre boş olamaz!");
            });

            RuleFor(x => x.Data)
                .NotNull()
                    .WithMessage("Giriş bilgileri boş olamaz!");
        }
    }
}
