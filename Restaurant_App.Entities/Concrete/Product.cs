using Restaurant_App.Entities.Abstract;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
            CartItems = new List<CartItem>();
            ProductCategory = new List<ProductCategory>();
            Comments = new List<Comment>();
            Ratings = new List<Rating>();
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
