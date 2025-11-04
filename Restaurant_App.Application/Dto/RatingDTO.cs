using Restaurant_App.Entities.Enum;

namespace Restaurant_App.Application.Dto
{
    public class RatingDTO: BaseDTO
    {
        public int ProductId { get; set; }
        public decimal AverageRating { get; set; }
        public int TotalRatings { get; set; }
        public RatingValue Value { get; set; } = RatingValue.Zero;
        public string UserId { get; set; } = string.Empty;
        public string Comment { get; set; } = string.Empty;
    }
}
