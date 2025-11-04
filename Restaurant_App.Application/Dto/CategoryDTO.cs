namespace Restaurant_App.Application.Dto
{
    public class CategoryDTO: BaseDTO
    {
        public string Name { get; set; } = string.Empty;
        public List<ProductDTO> Products { get; set; } = new List<ProductDTO>();
        public string Description { get; set; } = string.Empty;
    }
}
