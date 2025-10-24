namespace Restaurant_App.WebAPI.Dto
{
    public class RatingDTO: BaseDTO
    {
        public int ProductId { get; set; }
        public double AverageRating { get; set; }
        public int TotalRatings { get; set; }
        public int Value { get; set; }
        public string? UserId { get; set; }
        public string? Comment { get; set; }
    }
}
