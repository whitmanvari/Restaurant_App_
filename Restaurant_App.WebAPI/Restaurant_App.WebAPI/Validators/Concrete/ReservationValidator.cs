using FluentValidation;
using Restaurant_App.WebAPI.Dto;
using Restaurant_App.WebAPI.Validators.Abstract;
using Restaurant_App.WebAPI.ViewModels.Concrete;

namespace Restaurant_App.WebAPI.Validators.Concrete
{
    public class ReservationValidator : BaseValidator<ReservationViewModel, ReservationDTO>
    {
        public ReservationValidator()
        {
            ValidateWhenDataExists(() =>
            {
                RuleFor(x => x.Data!.CustomerName)
                    .NotEmpty()
                        .WithMessage("Müşteri adı boş geçilemez!");

                RuleFor(x => x.Data!.CustomerPhone)
                    .Matches(@"^\+?\d{10,15}$")
                        .WithMessage("Telefon numarası geçerli bir formatta olmalıdır!");

                RuleFor(x => x.Data!.NumberOfGuests)
                    .GreaterThan(0)
                        .WithMessage("Misafir sayısı 0'dan büyük olmalıdır!");

                RuleFor(x => x.Data!.ReservationDate)
                    .GreaterThan(DateTime.Now)
                        .WithMessage("Rezervasyon tarihi bugünden sonraki bir tarih olmalıdır!");
            });

            RuleFor(x => x.Data)
                .NotNull()
                    .WithMessage("Rezervasyon bilgisi boş olamaz!");
        }
    }
}

