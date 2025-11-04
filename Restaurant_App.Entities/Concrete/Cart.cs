using Restaurant_App.Entities.Abstract;
using System.ComponentModel.DataAnnotations.Schema;


namespace Restaurant_App.Entities.Concrete
{
    [Table("Carts")]
    public class Cart: BaseEntity
    {
        public string UserId { get; set; } = string.Empty;
        public List<CartItem> CartItems { get; set; }
        public Cart()
        {
            CartItems = new List<CartItem>();
        }
    }
}
