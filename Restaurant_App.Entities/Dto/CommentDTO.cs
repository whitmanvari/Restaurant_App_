namespace Restaurant_App.Entities.Dto
{
    public class CommentDTO: BaseDTO
    {
        public string? Text { get; set; }
        public int ProductId { get; set; }
        public string? UserId { get; set; }
        public int RatingValue { get; set; }
    }
}
