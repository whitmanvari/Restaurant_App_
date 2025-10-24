
namespace Restaurant_App.WebAPI.Dto
{
    public class CategoryDTO: BaseDTO
    {
        public List<ProductDTO>? Products { get; set; }
    }
}
