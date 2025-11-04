namespace Restaurant_App.Application.Dto
{
    public class OrderItemDTO : BaseDTO
    {
        public int ProductId { get; set; }
        public string? ProductName { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public decimal TotalPrice
        {
            get
            {
                return Quantity * Price;
            }
        }
    }
}
