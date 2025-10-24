using Restaurant_App.Business.Dto;

namespace Restaurant_App.WebAPI.Dto
{
    public class CartDTO: BaseDTO
    {
        public string? UserId { get; set; }
        public List<CartItemDTO> Items { get; set; } = new();
        public double TotalAmount
        {
            get
            {
                return Items.Sum(i => i.TotalPrice);
            }
        }
    }
}
