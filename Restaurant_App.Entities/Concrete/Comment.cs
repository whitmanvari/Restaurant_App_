using Restaurant_App.Entities.Abstract;
using System.ComponentModel.DataAnnotations.Schema;

namespace Restaurant_App.Entities.Concrete
{
    [Table("Comments")]
    public class Comment: BaseEntity
    {
        public string? Text { get; set; }
        public Rating? Rating { get; set; }
        public int RatingId { get; set; } 
        public string UserId { get; set; } = string.Empty;
        public Product? Product { get; set; }
        public int ProductId { get; set; }
    }
}
