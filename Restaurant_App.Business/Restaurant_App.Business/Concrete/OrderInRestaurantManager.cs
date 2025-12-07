using Restaurant_App.Business.Abstract;
using Restaurant_App.DataAccess.Abstract;
using Restaurant_App.Entities.Concrete;
using Restaurant_App.Entities.Enums;
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

            //  Fiyatı yeniden hesapla
            await RecalculateTotalAmount(orderInRestaurantId);
        }

        public async Task RemoveOrderItem(int orderInRestaurantId, int orderItemId)
        {
            await _orderInRestaurantDal.RemoveOrderItem(orderInRestaurantId, orderItemId);

            await RecalculateTotalAmount(orderInRestaurantId);
        }

        // Yardımcı Metod: Veritabanından son hali çekip toplar ve günceller
        private async Task RecalculateTotalAmount(int orderId)
        {
            var order = await _orderInRestaurantDal.GetOrderWithDetails(orderId);
            if (order != null)
            {
                // İlişkili ürünlerin fiyatlarını topla
                double total = 0;
                foreach (var item in order.OrderItemsInRestaurant)
                {
                    // OrderItem içinde Price saklıyoruz
                    total += (double)(item.Price * item.Quantity);
                }

                order.TotalAmount = total;
                await _orderInRestaurantDal.Update(order);
            }
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


        public async Task Update(OrderInRestaurant entity)
        {
            await _orderInRestaurantDal.Update(entity);
        }

        public async Task UpdateOrderStatus(int orderInRestaurantId, OrderStatusInRestaurant status)
        {
            await _orderInRestaurantDal.UpdateOrderStatus(orderInRestaurantId, status);
        }

        public async Task ClearOrderItems(int orderInRestaurantId)
        {
            // 1. Veritabanından kalemleri sil
            await _orderInRestaurantDal.ClearOrderItems(orderInRestaurantId);

            // 2. Toplam tutarı yeniden hesapla (0 olacak ve DB güncellenecek)
            await RecalculateTotalAmount(orderInRestaurantId);
        }
    }
}
