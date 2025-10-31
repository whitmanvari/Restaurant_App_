
namespace Restaurant_App.Entities.Dto
{
    public class OrderInRestaurantDTO: BaseDTO
    {
        public int TableId { get; set; }
        public string? TableNumber { get; set; }
        public double TotalAmount { get; set; }
        public string Status { get; set; } = "";
        public List<OrderItemInRestaurantDTO>? OrderItems { get; set; }
    }
}
