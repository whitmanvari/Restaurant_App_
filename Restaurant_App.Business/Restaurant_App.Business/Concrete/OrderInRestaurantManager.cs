using Restaurant_App.Business.Abstract;
using Restaurant_App.DataAccess.Abstract;
using Restaurant_App.Entities.Concrete;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Restaurant_App.Business.Concrete
{
    public class OrderInRestaurantManager: IOrderInRestaurantService
    {
        private readonly IOrderInRestaurantDal _orderInRestaurantDal;
        public OrderInRestaurantManager(IOrderInRestaurantDal orderInRestaurantDal)
        {
            _orderInRestaurantDal = orderInRestaurantDal;
        }

        public async Task AddOrderItem(int orderInRestaurantId, OrderItemInRestaurant orderItem)
        {
            await _orderInRestaurantDal.AddOrderItem(orderInRestaurantId, orderItem);
        }

        public async Task ClearOrderItems(int orderInRestaurantId)
        {
            await _orderInRestaurantDal.ClearOrderItems(orderInRestaurantId);
        }

        public async Task<List<OrderInRestaurant>> GetOrdersByStatus(OrderStatusInRestaurant status)
        {
            return await _orderInRestaurantDal.GetOrdersByStatus(status);
        }

        public async Task<List<OrderInRestaurant>> GetOrdersByTableId(int tableId)
        {
            return await _orderInRestaurantDal.GetOrdersByTableId(tableId);
        }

        public async Task<List<OrderInRestaurant>> GetOrdersWithDetails()
        {
            return await _orderInRestaurantDal.GetOrdersWithDetails();
        }

        public async Task<OrderInRestaurant?> GetOrderWithDetails(int orderInRestaurantId)
        {
            return await _orderInRestaurantDal.GetOrderWithDetails(orderInRestaurantId);
        }

        public async Task RemoveOrderItem(int orderInRestaurantId, int orderItemId)
        {
            await _orderInRestaurantDal.RemoveOrderItem(orderInRestaurantId, orderItemId);
        }

        public async Task UpdateOrderStatus(int orderInRestaurantId, OrderStatusInRestaurant status)
        {
            await _orderInRestaurantDal.UpdateOrderStatus(orderInRestaurantId, status);
        }
    }
}
