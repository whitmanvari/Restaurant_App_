using Restaurant_App.Application.Validators.Abstract;
using Restaurant_App.Application.Dto;

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
            NotEmptyString(x => x.CategoryName, "Kategori ismi boş geçilemez!", 20);
        }
    }
}