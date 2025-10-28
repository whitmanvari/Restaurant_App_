using Restaurant_App.Entities.Abstract;
using System.ComponentModel.DataAnnotations.Schema;

namespace Restaurant_App.Entities.Concrete
{
    [Table("Product")]
    public class Product: BaseEntity
    {
        public string Description { get; set; }
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
            CartItems = [];
            ProductCategory = [];
            Comments = [];
            Ratings = [];
        }
        
    }
    public enum Allergic
    {
        None,
        Gluten,
        Nuts,
        Dairy,
        Soy,
        Eggs,
        Shellfish,
        Fish,
        Peanuts,
        TreeNuts,
        Wheat,
        Sesame
    }
}
