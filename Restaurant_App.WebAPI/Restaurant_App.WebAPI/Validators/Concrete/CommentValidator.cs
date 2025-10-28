using FluentValidation;
using Restaurant_App.WebAPI.Dto;
using Restaurant_App.WebAPI.Validators.Abstract;
using Restaurant_App.WebAPI.ViewModels.Concrete;

namespace Restaurant_App.WebAPI.Validators.Concrete
{
    public class CommentValidator : BaseValidator<CommentViewModel, CommentDTO>
    {
        public CommentValidator()
        {
            ValidateWhenDataExists(() =>
            {
                RuleFor(x => x.Data!.Text)
                    .NotEmpty()
                        .WithMessage("Yorum metni boş olamaz!")
                    .MaximumLength(300)
                        .WithMessage("Yorum 300 karakteri geçemez!");

                RuleFor(x => x.Data!.RatingValue)
                    .InclusiveBetween(1, 5)
                        .WithMessage("Değerlendirme 1 ile 5 arasında olmalıdır!");
            });

            RuleFor(x => x.Data)
                .NotNull()
                    .WithMessage("Yorum bilgisi boş olamaz!");
        }
    }
}
