using Restaurant_App.Entities.Concrete;

namespace Restaurant_App.DataAccess.Abstract
{
    public interface IOrderDal: IRepository<Order>
    {
        Task<List<Order>> GetOrdersByUserId(string userId);
        Task<Order?> GetOrderDetails(int orderId);
    }
}
