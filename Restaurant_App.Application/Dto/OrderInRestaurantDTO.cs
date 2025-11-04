namespace Restaurant_App.Application.Dto
{
    public class OrderInRestaurantDTO: BaseDTO
    {
        public int TableId { get; set; }
        public string TableNumber { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = string.Empty;
        public List<OrderItemInRestaurantDTO> OrderItems { get; set; } = new List<OrderItemInRestaurantDTO>();
    }
}
