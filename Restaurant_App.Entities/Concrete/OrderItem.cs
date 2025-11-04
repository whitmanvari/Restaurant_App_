using Restaurant_App.Entities.Abstract;
using System.ComponentModel.DataAnnotations.Schema;

namespace Restaurant_App.Entities.Concrete
{
    [Table("OrderItems")]
    public class OrderItem: BaseEntity
    {
        public int OrderId { get; set; }
        public Order? Order { get; set; }
        public int ProductId { get; set; }
        public Product? Product { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
    }
}
