using FluentValidation;
using Restaurant_App.Application.Dto;
using Restaurant_App.Application.Validators.Abstract;

namespace Restaurant_App.Application.Validators.Concrete
{
    public class ProductValidator : BaseValidator<ProductDTO>
    {
        public ProductValidator()
        {
            PriceMustBePositive(x => x.Price);
            ListMustNotBeEmpty(x => x.ImageUrls, "Resimler boş geçilemez!");
            NotEmptyString(x => x.Name, "Ürün adı boş geçilemez!");
            NotEmptyString(x => x.Description, "Ürün açıklaması boş geçilemez!", 500);
            RuleFor(x => x.CategoryId)
                .GreaterThan(0)
                .WithMessage("Geçerli bir kategori seçilmelidir!");
        }
    }
}