using Restaurant_App.Entities.Concrete;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Restaurant_App.DataAccess.Abstract
{
    public interface IOrderInRestaurantDal: IRepository<OrderInRestaurant>
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
