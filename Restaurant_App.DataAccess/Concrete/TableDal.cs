using Microsoft.EntityFrameworkCore;
using Restaurant_App.DataAccess.Abstract;
using Restaurant_App.DataAccess.Concrete.EfCore;
using Restaurant_App.Entities.Concrete;

namespace Restaurant_App.DataAccess.Concrete
{
    public class TableDal : GenericRepository<Table, RestaurantDbContext>, ITableDal
    {
        public TableDal(RestaurantDbContext context) : base(context)
        {
        }

        public async Task<List<Table>> GetAllTablesWithDetails()
        {
            return await _context.Tables
                .Include(t => t.Reservations)
                .Include(t => t.OrdersInRestaurant)
                .ToListAsync();
        }

        public async Task<int> GetAvailableTableCount()
        {
            return await _context.Tables.CountAsync(t => t.IsAvailable);
        }

        // Burada sadece kapasiteye ve fiziksel uygunluğa (bozuk mu?) bakıyoruz.
        public async Task<List<Table>> GetAvailableTables(DateTime reservationDate, int numberOfGuests)
        {
            return await _context.Tables
                 .Where(t => t.IsAvailable && t.Capacity >= numberOfGuests)
                 .ToListAsync();
        }

        public async Task<Table?> GetTableWithOrders(int tableId)
        {
            var table = await _context.Tables
                .Include(t => t.OrdersInRestaurant)
                .FirstOrDefaultAsync(t => t.Id == tableId);

            return table ?? throw new ArgumentNullException(nameof(table), "Masa bulunamadı!");
        }

        public async Task<Table?> GetTableWithReservations(int tableId)
        {
            var table = await _context.Tables
                .Include(t => t.Reservations)
                .FirstOrDefaultAsync(t => t.Id == tableId);

            return table ?? throw new ArgumentNullException(nameof(table), "Masa bulunamadı!");
        }

        public async Task<int> GetTotalTableCount()
        {
            return await _context.Tables.CountAsync();
        }

        public async Task UpdateTableAvailability(int tableId, bool isAvailable)
        {
            var table = await _context.Tables.FindAsync(tableId);
            if (table is not null)
            {
                table.IsAvailable = isAvailable;
                await _context.SaveChangesAsync();
            }
        }
    }
}