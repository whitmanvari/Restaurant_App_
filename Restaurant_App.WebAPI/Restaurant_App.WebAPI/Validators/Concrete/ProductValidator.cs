using FluentValidation;
using Restaurant_App.WebAPI.Dto;
using Restaurant_App.WebAPI.Validators.Abstract;
using Restaurant_App.WebAPI.ViewModels.Concrete;

namespace Restaurant_App.WebAPI.Validators.Concrete
{
    public class ProductValidator : BaseValidator<ProductViewModel, ProductDTO>
    {
        public ProductValidator()
        {
            ValidateWhenDataExists(() =>
            {
                RuleFor(x => x.Data!.Name)
                    .NotEmpty()
                        .WithMessage("Ürün adı boş geçilemez!")
                    .Length(2, 100)
                        .WithMessage("Ürün ismi 2-100 karakter bandında olmalıdır!");

                RuleFor(x => x.Data!.Description)
                    .NotEmpty()
                        .WithMessage("Ürün açıklaması boş olamaz!")
                    .MinimumLength(2)
                        .WithMessage("Ürün açıklaması en az 2 karakter olmalıdır!")
                    .MaximumLength(500)
                        .WithMessage("Ürün açıklaması 500 karakteri geçemez!");

                RuleFor(x => x.Data!.Price)
                    .GreaterThan(0)
                        .WithMessage("Fiyat 0'dan büyük olmalıdır!");

                RuleFor(x => x.Data!.CategoryId)
                    .GreaterThan(0)
                        .WithMessage("Kategori seçimi zorunludur!");
            });

            RuleFor(x => x.Data)
                .NotNull()
                    .WithMessage("Ürün bilgisi boş olamaz!");
        }
    }
}

