using Microsoft.EntityFrameworkCore;
using Restaurant_App.DataAccess.Abstract;
using Restaurant_App.DataAccess.Concrete.EfCore;
using Restaurant_App.Entities.Concrete;
using Restaurant_App.Entities.Enums;

namespace Restaurant_App.DataAccess.Concrete
{
    public class OrderInRestaurantDal : GenericRepository<OrderInRestaurant, RestaurantDbContext>, IOrderInRestaurantDal
    {
        public OrderInRestaurantDal(RestaurantDbContext context) : base(context)
        {
        }
        public async Task AddOrderItem(int orderInRestaurantId, OrderItemInRestaurant orderItem)
        {
            var order = await _context.OrdersInRestaurant
                .Include(o => o.OrderItemsInRestaurant)
                .FirstOrDefaultAsync(o => o.Id == orderInRestaurantId);

            if (order != null)
            {
                order.OrderItemsInRestaurant.Add(orderItem);
                await _context.SaveChangesAsync();
                return; 
            }

            // Eğer order null ise buraya düşer
            throw new Exception("Sipariş bulunamadı!");
        }
        public async Task ClearOrderItems(int orderInRestaurantId)
        {
            var orderItems = await _context.OrderItemsInRestaurant
                .Where(oi => oi.OrderInRestaurantId == orderInRestaurantId)
                .ToListAsync();
            if (orderItems != null)
            {
                if (orderItems.Count != 0)
                {
                    _context.OrderItemsInRestaurant.RemoveRange(orderItems);
                    await _context.SaveChangesAsync();
                }
                throw new Exception("Siparişe ait ürün bulunamadı!");
            }
        }
        public async Task<List<OrderInRestaurant>> GetOrdersByStatus(OrderStatusInRestaurant status)
        {
            return await _context.OrdersInRestaurant
                .Include(o => o.OrderItemsInRestaurant)
                .Where(o => o.Status == status)
                .ToListAsync();
        }
        public async Task<List<OrderInRestaurant>> GetOrdersByTableId(int tableId)
        {
            return await _context.OrdersInRestaurant
                .Include(o => o.OrderItemsInRestaurant)
                .Where(o => o.TableId == tableId)
                .ToListAsync();
        }
        public async Task<List<OrderInRestaurant>> GetOrdersWithDetails()
        {
            return await _context.OrdersInRestaurant
                .Include(o => o.OrderItemsInRestaurant)
                .Include(o => o.Table)
                .ToListAsync();
        }
        public async Task<OrderInRestaurant?> GetOrderWithDetails(int orderInRestaurantId)
        {
            var order = await _context.OrdersInRestaurant
                .Include(o => o.OrderItemsInRestaurant)
                .Include(o => o.Table)
                .FirstOrDefaultAsync(o => o.Id == orderInRestaurantId);
            return order;
        }
        public async Task RemoveOrderItem(int orderInRestaurantId, int orderItemId)
        {
            var order = await _context.OrdersInRestaurant
                .Include(o => o.OrderItemsInRestaurant)
                .FirstOrDefaultAsync(o => o.Id == orderInRestaurantId);
            if (order != null)
            {
                var orderItem = order.OrderItemsInRestaurant.FirstOrDefault(oi => oi.Id == orderItemId);
                if (orderItem != null)
                {
                    _context.OrderItemsInRestaurant.Remove(orderItem);
                    await _context.SaveChangesAsync();
                }
                else
                {
                    throw new Exception("Sipariş ürünü bulunamadı!");
                }
            }
            else
            {
                throw new Exception("Sipariş bulunamadı!");
            }
        }
        public async Task UpdateOrderStatus(int orderInRestaurantId, OrderStatusInRestaurant status)
        {
            var order = await _context.OrdersInRestaurant.FindAsync(orderInRestaurantId);
            if (order != null)
            {
                order.Status = status;
                await _context.SaveChangesAsync();
            }
            else
            {
                throw new Exception("Siparişiniz bulunamadı!");
            }
        }
    }
}