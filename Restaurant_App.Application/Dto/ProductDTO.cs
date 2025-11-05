namespace Restaurant_App.Application.Dto
{
    public class ProductDTO: BaseDTO
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int Allergic { get; set; } = 0; //Allergic.none => 0
        public double AverageRating { get; set; }
        public int TotalRatings { get; set; }
        public decimal Price { get; set; }
        public int CategoryId { get; set; }
        public List<string> ImageUrls { get; set; } = new List<string>();
        public string CategoryName { get; set; } = string.Empty;
    }
}
