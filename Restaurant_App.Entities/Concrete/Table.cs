using Restaurant_App.Entities.Abstract;
using System.ComponentModel.DataAnnotations.Schema;

namespace Restaurant_App.Entities.Concrete
{
    [Table("Tables")]
    public class Table: BaseEntity
    {
        public string? TableNumber { get; set; }
        public int Capacity { get; set; }
        public bool IsAvailable { get; set; } = true;
        public List<OrderInRestaurant>? OrdersInRestaurant { get; set; }
        public List<Reservation>? Reservations { get; set; }
        public List<Order>? Orders { get; set; }
        public Table()
        {
            Reservations = new List<Reservation>();
            OrdersInRestaurant = new List<OrderInRestaurant>();
            Orders = new List<Order>();
        }
    }
}
