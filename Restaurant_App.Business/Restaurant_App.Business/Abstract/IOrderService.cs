using Restaurant_App.Entities.Concrete;

namespace Restaurant_App.Business.Abstract
{
    public interface IOrderService
    {
        Task<List<Order>> GetOrdersByUserId(string userId);
        Task<Order?> GetOrderDetails(int orderId);
        
    }
}
