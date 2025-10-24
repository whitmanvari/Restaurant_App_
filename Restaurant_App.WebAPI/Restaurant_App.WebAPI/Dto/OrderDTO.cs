
namespace Restaurant_App.WebAPI.Dto
{
    public class OrderDTO: BaseDTO
    {
        public string? OrderNum { get; set; }
        public DateTime OrderDate { get; set; }
        public string? UserId { get; set; }
        public string? Address { get; set; }
        public string? City { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? OrderNote { get; set; }
        public string? PaymentId { get; set; }
        public double TotalAmount { get; set; }
        public List<OrderItemDTO> Items { get; set; } = new();
    }
}
