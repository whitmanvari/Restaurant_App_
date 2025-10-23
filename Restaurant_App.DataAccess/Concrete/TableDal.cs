using Microsoft.EntityFrameworkCore;
using Restaurant_App.DataAccess.Abstract;
using Restaurant_App.DataAccess.Concrete.EfCore;
using Restaurant_App.Entities.Concrete;

namespace Restaurant_App.DataAccess.Concrete
{
    public class TableDal : GenericRepository<Table, RestaurantDbContext>, ITableDal
    {
        public async Task<List<Table>> GetAllTablesWithDetails()
        {
            await using var _context = new RestaurantDbContext();

            return await _context.Tables
                .Include(t => t.Reservations)
                .Include(t => t.OrdersInRestaurant)
                .Include(t => t.Orders)
                .ToListAsync();
        }

        public async Task<int> GetAvailableTableCount()
        {
            await using var _context = new RestaurantDbContext();
            return await _context.Tables.CountAsync(t => t.IsAvailable);
        }

        public async Task<List<Table>> GetAvailableTables(DateTime reservationDate, int numberOfGuests)
        {
            await using var _context = new RestaurantDbContext();
            return await _context.Tables
                .Where(t => t.IsAvailable && t.Capacity >= numberOfGuests)
                .ToListAsync();
        }

        public async Task<Table?> GetTableWithOrders(int tableId)
        {
            await using var _context = new RestaurantDbContext();
            var table = await _context.Tables
                .Include(t => t.OrdersInRestaurant)
                .FirstOrDefaultAsync(t => t.Id == tableId);

            return table ?? throw new ArgumentNullException(nameof(table), "Masa bulunamadı!");
        }

        public async Task<Table?> GetTableWithReservations(int tableId)
        {
            await using var _context = new RestaurantDbContext();
            var table = await _context.Tables
                .Include(t => t.Reservations)
                .FirstOrDefaultAsync(t => t.Id == tableId);

            return table ?? throw new ArgumentNullException(nameof(table), "Masa bulunamadı!");
        }

        public async Task<int> GetTotalTableCount()
        {
            await using var _context = new RestaurantDbContext();
            return await _context.Tables.CountAsync();
        }

        public async Task UpdateTableAvailability(int tableId, bool isAvailable)
        {
            await using var _context = new RestaurantDbContext();
            var table = await _context.Tables.FindAsync(tableId);
            if (table is not null)
            {
                table.IsAvailable = isAvailable;
                await _context.SaveChangesAsync();
            }
        }
    }
}
