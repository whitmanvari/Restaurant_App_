namespace Restaurant_App.Application.Dto
{
    public class OrderDTO: BaseDTO
    {
        public string? OrderNum { get; set; }
        public DateTime OrderDate { get; set; }
        public string UserId { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string OrderNote { get; set; } = string.Empty;
        public string PaymentId { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }
        public List<OrderItemDTO> Items { get; set; } = new List<OrderItemDTO>();
    }
}
