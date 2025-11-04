using Restaurant_App.Business.Abstract;
using Restaurant_App.DataAccess.Abstract;
using Restaurant_App.Entities.Concrete;
using Restaurant_App.Entities.Enum;
using System.Linq.Expressions;

namespace Restaurant_App.Business.Concrete
{
    public class OrderInRestaurantManager: IOrderInRestaurantService, IService<OrderInRestaurant>
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

        public async Task Create(OrderInRestaurant entity)
        {
            await _orderInRestaurantDal.Create(entity);
        }

        public async Task Delete(OrderInRestaurant entity)
        {
            await _orderInRestaurantDal.Delete(entity);
        }

        public async Task<List<OrderInRestaurant>> GetAll(Expression<Func<OrderInRestaurant, bool>>? filter = null)
        {
            return await _orderInRestaurantDal.GetAll(filter);
        }

        public async Task<OrderInRestaurant> GetById(int id)
        {
            return await _orderInRestaurantDal.GetById(id);
        }

        public async Task<OrderInRestaurant> GetOne(Expression<Func<OrderInRestaurant, bool>>? filter = null)
        {
            return await _orderInRestaurantDal.GetOne(filter);
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

        public async Task Update(OrderInRestaurant entity)
        {
            await _orderInRestaurantDal.Update(entity);
        }

        public async Task UpdateOrderStatus(int orderInRestaurantId, OrderStatusInRestaurant status)
        {
            await _orderInRestaurantDal.UpdateOrderStatus(orderInRestaurantId, status);
        }
    }
}
