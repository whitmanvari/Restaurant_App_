using Microsoft.EntityFrameworkCore;
using Restaurant_App.DataAccess.Abstract;
using Restaurant_App.DataAccess.Concrete.EfCore;
using Restaurant_App.Entities.Concrete;

namespace Restaurant_App.DataAccess.Concrete
{
    public class OrderDal : GenericRepository<Order, RestaurantDbContext>, IOrderDal
    {
        public OrderDal(RestaurantDbContext context) : base(context)
        {
        }

        public async Task<Order?> GetOrderDetails(int orderId)
        {
            await using RestaurantDbContext _context = new(); //using var da yazabilirdik ama using var da Dispose senkron çalışır async değil
            return await _context.Orders
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                .FirstOrDefaultAsync(o => o.Id == orderId); //null döndürebilir o sebeple order? kullandık
        }

        public async Task<List<Order>> GetOrdersByUserId(string userId)
        {
            await using RestaurantDbContext _context = new();
            return await _context.Orders
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                .Where(o => o.UserId == userId)
                .ToListAsync(); //null döndüremez çünkü boş liste döner
        }
    }
}
