namespace Restaurant_App.WebAPI.Dto
{
    public class CartItemDTO: BaseDTO
    {
        public int ProductId { get; set; }
        public string? ProductName { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public double TotalPrice
        {
            get
            {
                return (double)(Price * Quantity);
            }
        }
    }
}
