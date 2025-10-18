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
        List<OrderInRestaurant> GetOrdersWithDetails();
        OrderInRestaurant GetOrderWithDetails(int orderInRestaurantId);
        List<OrderInRestaurant> GetOrdersByTableId(int tableId);
        List<OrderInRestaurant> GetOrdersByStatus(OrderStatusInRestaurant status);
        void UpdateOrderStatus(int orderInRestaurantId, OrderStatusInRestaurant status);
        void AddOrderItem(int orderInRestaurantId, OrderItemInRestaurant orderItem);
        void RemoveOrderItem(int orderInRestaurantId, int orderItemId);
        void ClearOrderItems(int orderInRestaurantId);


    }
}
