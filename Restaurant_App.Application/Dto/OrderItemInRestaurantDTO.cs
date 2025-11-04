namespace Restaurant_App.Application.Dto
{
    public class OrderItemInRestaurantDTO: BaseDTO
    {
        public int ProductId { get; set; }
        public string? ProductName { get; set; }
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
