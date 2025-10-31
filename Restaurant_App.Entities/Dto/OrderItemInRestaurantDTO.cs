namespace Restaurant_App.Entities.Dto
{
    public class OrderItemInRestaurantDTO: BaseDTO
    {
        public int ProductId { get; set; }
        public string? ProductName { get; set; }
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
