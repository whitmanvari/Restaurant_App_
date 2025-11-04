using Restaurant_App.Entities.Abstract;
using System.ComponentModel.DataAnnotations.Schema;

namespace Restaurant_App.Entities.Concrete
{
    [Table("CartItems")]
    public class CartItem: BaseEntity
    {
        public int ProductId { get; set; }
        public Product? Product { get; set; }
        public int? Quantity { get; set; }
        public required int CartId { get; set; }
        public Cart? Cart { get; set; }
        public decimal TotalPrice { get; set; } = 0.0m;
    }
}
