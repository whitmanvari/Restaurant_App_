using Restaurant_App.Entities.Abstract;
using Restaurant_App.Entities.Enum;
using System.ComponentModel.DataAnnotations.Schema;

namespace Restaurant_App.Entities.Concrete
{
    [Table("Orders")]
    public class Order : BaseEntity
    {
        public string OrderNum { get; set; }
        public DateTime OrderDate { get; set; }
        public string UserId { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string OrderNote { get; set; } = string.Empty;
        public string PaymentId { get; set; } = string.Empty;
        public string PaymentToken { get; set; } = string.Empty;
        public string ConversionId { get; set; } = string.Empty;
        public OrderState OrderState { get; set; } = OrderState.Waiting;
        public PaymentTypes PaymentTypes { get; set; }
        public List<OrderItem> OrderItems { get; set; }
        public Order()
        {
            OrderItems = new List<OrderItem>();
        }
    }
}
