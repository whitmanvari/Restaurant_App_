namespace Restaurant_App.WebAPI.Dto
{
    public class ProductDTO: BaseDTO
    {
        public string? Description { get; set; }
        public double Price { get; set; }
        public int CategoryId { get; set; }
        public List<string>? ImageUrls { get; set; }
        public string? CategoryName { get; set; }
    }
}
