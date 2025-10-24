namespace Restaurant_App.WebAPI.Dto
{
    public class OrderItemDTO : BaseDTO
    {
        public int ProductId { get; set; }
        public string? ProductName { get; set; }
        public double Price { get; set; }
        public int Quantity { get; set; }
        public double TotalPrice
        {
            get
            {
                return Quantity * Price;
            }
        }
    }
}
