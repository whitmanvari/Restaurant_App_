using Restaurant_App.Entities.Enums;

namespace Restaurant_App.Application.Dto
{
    public class ProductDTO: BaseDTO
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public Allergic Allergic { get; set; } = Allergic.None;
        public decimal Price { get; set; }
        public int CategoryId { get; set; }
        public List<string> ImageUrls { get; set; } = new List<string>();
        public string CategoryName { get; set; } = string.Empty;
    }
}
