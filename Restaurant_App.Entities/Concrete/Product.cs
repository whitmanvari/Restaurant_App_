using Restaurant_App.Entities.Abstract;
using Restaurant_App.Entities.Enum;
using System.ComponentModel.DataAnnotations.Schema;

namespace Restaurant_App.Entities.Concrete
{
    [Table("Products")]
    public class Product: BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public Allergic Allergic { get; set; } = Allergic.None;
        public double Price { get; set; }
        public List<Image> Images { get; set; }
        public List<CartItem> CartItems { get; set; }
        public List<ProductCategory> ProductCategory { get; set; }
        public List<Comment> Comments { get; set; }
        public List<Rating> Ratings { get; set; }
        public Category Category { get; set; }
        public int CategoryId { get; set; }
        public List<OrderItemInRestaurant> OrderItemsInRestaurant { get; set; }
        public List<OrderItem> OrderItems { get; set; }
        public Product()
        {
            CartItems = new List<CartItem>();
            ProductCategory = new List<ProductCategory>();
            Comments = new List<Comment>();
            Ratings = new List<Rating>();
        }      
    }
}
