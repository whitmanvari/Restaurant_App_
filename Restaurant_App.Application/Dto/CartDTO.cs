namespace Restaurant_App.Application.Dto
{
    public class CartDTO: BaseDTO
    {
        public string UserId { get; set; } = string.Empty;
        public List<CartItemDTO> Items { get; set; } = new List<CartItemDTO>();
        public decimal TotalAmount
        {
            get
            {
                return Items.Sum(i => i.TotalPrice);
            }
        }
    }
}
