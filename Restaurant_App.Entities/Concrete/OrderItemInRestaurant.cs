using Restaurant_App.Entities.Abstract;

namespace Restaurant_App.Entities.Concrete
{
    public class OrderItemInRestaurant: BaseEntity
    {
        public int OrderInRestaurantId { get; set; }
        public OrderInRestaurant? OrderInRestaurant { get; set; }
        public int ProductId { get; set; }
        public Product Product { get; set; }
        public int Quantity { get; set; }
        public double Price { get; set; }
        public double TotalPrice 
        { 
            get
            {
                return Quantity * Price;
            }
        }
    }
}
