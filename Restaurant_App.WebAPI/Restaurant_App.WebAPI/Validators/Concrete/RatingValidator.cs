using FluentValidation;
using Restaurant_App.Entities.Dto;
using Restaurant_App.WebAPI.Validators.Abstract;
using Restaurant_App.WebAPI.ViewModels.Concrete;

namespace Restaurant_App.WebAPI.Validators.Concrete
{
    public class RatingValidator: BaseValidator<RatingViewModel, RatingDTO>
    {
        public RatingValidator()
        {
            ValidateWhenDataExists(() =>
            {
                RuleFor(x => x.Data!.ProductId)
                    .GreaterThan(0)
                        .WithMessage("Geçerli bir ürün ID'si giriniz!");

                RuleFor(x => x.Data!.Value)
                    .InclusiveBetween(1, 5)
                        .WithMessage("Puan 1-5 bandında olmalıdır!");

                RuleFor(x => x.Data!.Comment)
                    .MaximumLength(500)
                    .When(x => !string.IsNullOrEmpty(x.Data!.Comment))
                        .WithMessage("Yorum 500 karakteri geçemez!");
            });

            RuleFor(x => x.Data)
                .NotNull().WithMessage("Değerlendirme bilgisi boş olamaz!");
        }
    }
}
