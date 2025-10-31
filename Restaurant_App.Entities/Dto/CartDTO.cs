
namespace Restaurant_App.Entities.Dto
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
