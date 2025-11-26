using Restaurant_App.Entities.Abstract;
using Restaurant_App.Entities.Enums;
using System.ComponentModel.DataAnnotations.Schema;

namespace Restaurant_App.Entities.Concrete
{
    [Table("Products")]
    public class Product: BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public Allergic Allergic { get; set; } = Allergic.None;
        public string? Ingredients { get; set; }
        public decimal Price { get; set; }
        public List<Image> Images { get; set; }
        public List<CartItem> CartItems { get; set; }
        public List<Comment> Comments { get; set; }
        public List<Rating> Ratings { get; set; }
        public Category Category { get; set; }
        public int CategoryId { get; set; }
        public List<OrderItemInRestaurant> OrderItemsInRestaurant { get; set; }
        public List<OrderItem> OrderItems { get; set; }
        public Product()
        {
            Images = new List<Image>();
            CartItems = new List<CartItem>();
            Comments = new List<Comment>();
            Ratings = new List<Rating>();
            OrderItemsInRestaurant = new List<OrderItemInRestaurant>();
            OrderItems = new List<OrderItem>();
        }
    }
}
