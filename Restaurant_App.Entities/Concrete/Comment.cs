using Restaurant_App.Entities.Abstract;

namespace Restaurant_App.Entities.Concrete
{
    public class Comment: BaseEntity
    {
        public string? Text { get; set; }
        public Rating? Rating { get; set; }
        public int RatingId { get; set; } 
        public string UserId { get; set; }
        public Product? Product { get; set; }
        public int ProductId { get; set; }

    }
}
