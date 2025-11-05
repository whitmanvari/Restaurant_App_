using Restaurant_App.Entities.Abstract;
using Restaurant_App.Entities.Enums;
using System.ComponentModel.DataAnnotations.Schema;

namespace Restaurant_App.Entities.Concrete
{
    [Table("OrdersInRestaurant")]
    public class OrderInRestaurant: BaseEntity
    {
        public int TableId { get; set; }
        public Table? Table { get; set; }
        public DateTime OrderDate { get; set; }
        public double TotalAmount { get; set; }
        public OrderStatusInRestaurant Status { get; set; }
        public List<OrderItemInRestaurant> OrderItemsInRestaurant { get; set; }
        public OrderInRestaurant()
        {
            OrderItemsInRestaurant = new List<OrderItemInRestaurant>();
            OrderDate = DateTime.Now;
            Status = OrderStatusInRestaurant.Pending;
        }
    }   
}
