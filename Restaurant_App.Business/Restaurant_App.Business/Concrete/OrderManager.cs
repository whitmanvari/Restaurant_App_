using Restaurant_App.Business.Abstract;
using Restaurant_App.DataAccess.Abstract;
using Restaurant_App.DataAccess.Concrete.EfCore;
using Restaurant_App.Entities.Concrete;
using Restaurant_App.Entities.Enums;
using System.Linq.Expressions;

namespace Restaurant_App.Business.Concrete
{
    public class OrderManager : IOrderService, IService<Order>
    {
        private readonly IOrderDal _orderDal;
        private readonly IProductDal _productDal;
        public OrderManager(IOrderDal orderDal, IProductDal productDal)
        {
             _orderDal = orderDal;
            _productDal = productDal;
        }
        public async Task Create(Order order)
        {
            // --- GÜVENLİK ---
            decimal calculatedTotal = 0;

            foreach (var item in order.OrderItems)
            {
                // 1. Ürünün GERÇEK fiyatını veritabanından çek, fronttan gelirse açık (Insecure direct object reference IDOR veya Price Manipulation güvenlik açığı)
                var product = await _productDal.GetById(item.ProductId);
                if (product == null) throw new Exception($"Ürün bulunamadı: {item.ProductId}");

                // 2. Frontend'den gelen fiyatı EZ ve veritabanı fiyatını kullan
                item.Price = product.Price;

                // 3. Toplamı kendimiz hesaplayalım
                calculatedTotal += item.Quantity * item.Price;
            }

            // 4. Siparişin toplam tutarını da hesaplanan tutar ile güncelle
            order.TotalAmount = calculatedTotal;

            order.OrderDate = DateTime.Now;
            order.OrderState = OrderState.Waiting;

            await _orderDal.Create(order);
        }

        public async Task<List<Order>> GetOrdersByUserId(string userId)
        {
            return await _orderDal.GetOrdersByUserId(userId);
        }

        public async Task<List<Order>> GetAll(Expression<Func<Order, bool>>? filter = null)
        {
            return await _orderDal.GetAll(filter);
        }

        public async Task<Order> GetById(int id)
        {
            return await _orderDal.GetById(id);
        }

        public async Task<Order> GetOne(Expression<Func<Order, bool>>? filter = null)
        {
            return await _orderDal.GetOne(filter);
        }

        public async Task<Order?> GetOrderDetails(int orderId)
        {
            return await _orderDal.GetOrderDetails(orderId);
        }

        public async Task Update(Order order)
        {
            await _orderDal.Update(order);
        }

        public async Task Delete(Order entity)
        {
            await _orderDal.Delete(entity);
        }
    }
}
