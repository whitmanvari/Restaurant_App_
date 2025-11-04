using Restaurant_App.Entities.Concrete;
using Restaurant_App.Entities.Enum;

namespace Restaurant_App.Business.Abstract
{
    public interface IOrderInRestaurantService: IService<OrderInRestaurant>
    {
        Task<List<OrderInRestaurant>> GetOrdersWithDetails();
        Task<OrderInRestaurant?> GetOrderWithDetails(int orderInRestaurantId);
        Task<List<OrderInRestaurant>> GetOrdersByTableId(int tableId);
        Task<List<OrderInRestaurant>> GetOrdersByStatus(OrderStatusInRestaurant status);
        Task UpdateOrderStatus(int orderInRestaurantId, OrderStatusInRestaurant status);
        Task AddOrderItem(int orderInRestaurantId, OrderItemInRestaurant orderItem);
        Task RemoveOrderItem(int orderInRestaurantId, int orderItemId);
        Task ClearOrderItems(int orderInRestaurantId);
    }
}
