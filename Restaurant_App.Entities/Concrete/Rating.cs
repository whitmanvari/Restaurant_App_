using Restaurant_App.Entities.Abstract;
using Restaurant_App.Entities.Enums;
using System.ComponentModel.DataAnnotations.Schema;

namespace Restaurant_App.Entities.Concrete
{
    [Table("Ratings")]
    public class Rating: BaseEntity
    {
        public RatingValue Value { get; set; }
        public string UserId { get; set; }
        public List<Comment> Comments { get; set; }
        public Product Product { get; set; }
        public int ProductId { get; set; }
        public Rating()
        {
            Comments = new List<Comment>();
        }    
    }
}
