using FluentValidation;
using Restaurant_App.WebAPI.Dto;
using Restaurant_App.WebAPI.Validators.Abstract;
using Restaurant_App.WebAPI.ViewModels.Concrete;

namespace Restaurant_App.WebAPI.Validators.Concrete
{
    public class CategoryValidator : BaseValidator<CategoryViewModel, CategoryDTO>
    {
        public CategoryValidator()
        {
            ValidateWhenDataExists(() =>
            {
                RuleFor(x => x.Data!.Name)
                    .NotEmpty()
                        .WithMessage("Kategori adı boş geçilemez!")
                    .Length(2, 100)
                        .WithMessage("Kategori adı 2-100 karakter bandında olmalıdır!");
            });

            RuleFor(x => x.Data)
                .NotNull().WithMessage("Kategori bilgisi boş olamaz!");
        }
    }
}

