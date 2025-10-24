namespace Restaurant_App.WebAPI.Models.DTO_s
{
    public class CategoryDTO: BaseDTO
    {
        public List<ProductDTO>? Products { get; set; }
    }
}
