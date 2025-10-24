using FluentValidation;
using Restaurant_App.WebAPI.Dto;
using Restaurant_App.WebAPI.Validators.Abstract;
using Restaurant_App.WebAPI.ViewModels.Concrete;

namespace Restaurant_App.WebAPI.Validators.Concrete
{
    public class UserRegisterValidator : BaseValidator<UserRegisterViewModel, UserRegisterDTO>
    {
        public UserRegisterValidator()
        {
            ValidateWhenDataExists(() =>
            {
                RuleFor(x => x.Data!.FullName)
                    .NotEmpty()
                        .WithMessage("Ad-soyad alanı boş geçilemez!")
                    .Length(3, 50)
                        .WithMessage("Ad-soyad 3-50 karakter bandında olmalıdır!");

                RuleFor(x => x.Data!.Email)
                    .NotEmpty()
                        .EmailAddress()
                            .WithMessage("Geçerli bir e-posta adresi giriniz!");

                RuleFor(x => x.Data!.Password)
                    .NotEmpty()
                        .MinimumLength(6)
                    .Matches(@"[A-Z]+")
                        .WithMessage("Şifre en az bir büyük harf içermelidir.")
                    .Matches(@"[a-z]+")
                        .WithMessage("Şifre en az bir küçük harf içermelidir.")
                    .Matches(@"\d+")
                        .WithMessage("Şifre en az bir rakam içermelidir.");

                RuleFor(x => x.Data!.ConfirmPassword)
                    .Equal(x => x.Data!.Password)
                        .WithMessage("Parolalar eşleşmiyor!");
            });

            RuleFor(x => x.Data)
                .NotNull()
                    .WithMessage("Kullanıcı kayıt verisi boş olamaz!");
        }
    }
}

