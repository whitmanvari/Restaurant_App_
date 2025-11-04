using Restaurant_App.Entities.Abstract;
using System.ComponentModel.DataAnnotations.Schema;

namespace Restaurant_App.Entities.Concrete
{
    [Table("OrderItemsInRestaurant")]
    public class OrderItemInRestaurant: BaseEntity
    {
        public int OrderInRestaurantId { get; set; }
        public OrderInRestaurant? OrderInRestaurant { get; set; }
        public int ProductId { get; set; }
        public required Product Product { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public decimal TotalPrice 
        { 
            get
            {
                return Quantity * Price;
            }
        }
    }
}
