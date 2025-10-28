using Restaurant_App.Entities.Abstract;

namespace Restaurant_App.Entities.Concrete
{
    public class Order : BaseEntity
    {
        public string OrderNum { get; set; }
        public DateTime OrderDate { get; set; }
        public string UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string OrderNote { get; set; }
        public string PaymentId { get; set; }
        public string PaymentToken { get; set; }
        public string ConversionId { get; set; }
        public OrderState OrderState { get; set; }
        public PaymentTypes PaymentTypes { get; set; }
        public List<OrderItem> OrderItems { get; set; }

        public Order()
        {
            OrderItems = []; //Initilize simplify edildi, new List<OrderItem>();
        }
    }
    public enum OrderState
    {
        Waiting = 0,
        Completed = 1,
        Canceled = 2,
        Preparing = 3
    }
    public enum PaymentTypes
    {
        CreditCard = 0,
        Eft = 1,
        CashOnDelivery = 2
    }
}
