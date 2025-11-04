using Microsoft.EntityFrameworkCore;
using Restaurant_App.DataAccess.Abstract;
using Restaurant_App.DataAccess.Concrete.EfCore;
using Restaurant_App.Entities.Concrete;
using Restaurant_App.Entities.Enum;

namespace Restaurant_App.DataAccess.Concrete
{
    public class OrderInRestaurantDal : GenericRepository<OrderInRestaurant, RestaurantDbContext>, IOrderInRestaurantDal
    {
        public OrderInRestaurantDal(RestaurantDbContext context) : base(context)
        {
        }

        //Siparişe yeni ürün ekleme restorant içerisindeyken
        public async Task AddOrderItem(int orderInRestaurantId, OrderItemInRestaurant orderItem)
        {
            await using var context = new RestaurantDbContext();
            var order = await context.OrdersInRestaurant
                .Include(o => o.OrderItemsInRestaurant)
                .FirstOrDefaultAsync(o => o.Id == orderInRestaurantId);
            if (order != null)
            {
                order.OrderItemsInRestaurant.Add(orderItem);
                await context.SaveChangesAsync();
            }
            throw new Exception("Sipariş bulunamadı!");
        }
        //Siparişteki tüm ürünleri temizleme
        public async Task ClearOrderItems(int orderInRestaurantId)
        {
            await using var context = new RestaurantDbContext();
            var orderItems = await context.OrderItemsInRestaurant
                .Include(oi => oi.OrderInRestaurant) //ilişkili sipariş bilgisi, orderInRestaurantId'yi kontrol etmek için
                .Where(oi => oi.OrderInRestaurantId == orderInRestaurantId)
                .ToListAsync();
            if (orderItems != null)
            {
                if (orderItems.Count != 0) //eğer siparişe ait ürün varsa
                {
                    context.OrderItemsInRestaurant.RemoveRange(orderItems); //RemoveRange ile hepsini sil, veritabanından komple siler
                    await context.SaveChangesAsync();
                }
                throw new Exception("Siparişe ait ürün bulunamadı!");
            }
        }
        //Sipariş durumuna göre siparişleri getirme
        public async Task<List<OrderInRestaurant>> GetOrdersByStatus(OrderStatusInRestaurant status)
        {
            await using var context = new RestaurantDbContext();
            return await context.OrdersInRestaurant
                .Include(o => o.OrderItemsInRestaurant)
                .Where(o => o.Status == status)
                .ToListAsync();
        }

        public async Task<List<OrderInRestaurant>> GetOrdersByTableId(int tableId)
        {
            await using var context = new RestaurantDbContext();
            return await context.OrdersInRestaurant
                .Include(o => o.OrderItemsInRestaurant)
                .Where(o => o.TableId == tableId)
                .ToListAsync();
        }
        //Tüm siparişleri detaylarıyla birlikte getirme
        public async Task<List<OrderInRestaurant>> GetOrdersWithDetails()
        {
            await using var context = new RestaurantDbContext();
            return await context.OrdersInRestaurant
                .Include(o => o.OrderItemsInRestaurant)
                .Include(o=> o.Table)
                .ToListAsync();
        }
        //Belirli bir siparişi detaylarıyla birlikte getirme
        public async Task<OrderInRestaurant?> GetOrderWithDetails(int orderInRestaurantId)
        {
            await using var context = new RestaurantDbContext();
            var order = await context.OrdersInRestaurant
                .Include(o => o.OrderItemsInRestaurant)
                .Include(o => o.Table)
                .FirstOrDefaultAsync(o => o.Id == orderInRestaurantId);
            return order;
        }
        //Belirli bir siparişten ürün kaldırma
        public async Task RemoveOrderItem(int orderInRestaurantId, int orderItemId)
        {
            await using var context = new RestaurantDbContext();
            var order = await context.OrdersInRestaurant
                .Include(o => o.OrderItemsInRestaurant)
                .FirstOrDefaultAsync(o => o.Id == orderInRestaurantId);
            if (order != null)
            {
                var orderItem = order.OrderItemsInRestaurant.FirstOrDefault(oi => oi.Id == orderItemId);
                if (orderItem != null)
                {
                    context.OrderItemsInRestaurant.Remove(orderItem);
                    await context.SaveChangesAsync();
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
        //Sipariş durumunu güncelleme
        public async Task UpdateOrderStatus(int orderInRestaurantId, OrderStatusInRestaurant status)
        {
            await using var context = new RestaurantDbContext();
            var order = await context.OrdersInRestaurant.FindAsync(orderInRestaurantId);
            if (order != null)
            {
                order.Status = status;
                await context.SaveChangesAsync();
            }
            else
            {
                throw new Exception("Siparişiniz bulunamadı!");
            }
        }


    }
}
