using Restaurant_App.Entities.Abstract;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Restaurant_App.Entities.Concrete
{
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
    public enum OrderStatusInRestaurant
    {
        Pending = 0,
        InProgress = 1,
        Served = 2,
        Completed = 3,
        Canceled = 4
    }
}
