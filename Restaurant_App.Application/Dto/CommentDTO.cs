namespace Restaurant_App.Application.Dto
{
    public class CommentDTO: BaseDTO
    {
        public string Text { get; set; } = string.Empty;
        public int ProductId { get; set; }
        public string UserId { get; set; } = string.Empty;
        public int RatingValue { get; set; }
    }
}
