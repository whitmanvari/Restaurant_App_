using Restaurant_App.Application.Validators.Abstract;
using Restaurant_App.Application.Dto;

namespace Restaurant_App.Application.Validators.Concrete
{
    public class CategoryValidator : BaseValidator<CategoryDTO>
    {
        public CategoryValidator()
        {
            NotEmptyString(x => x.Name, "Kategori adı boş olamaz!");
            NotEmptyString(x => x.Description, "Açıklama boş olamaz!");
        }
    }
}

