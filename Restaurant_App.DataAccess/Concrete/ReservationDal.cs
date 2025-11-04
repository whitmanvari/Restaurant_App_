using Microsoft.EntityFrameworkCore;
using Restaurant_App.DataAccess.Abstract;
using Restaurant_App.DataAccess.Concrete.EfCore;
using Restaurant_App.Entities.Concrete;

namespace Restaurant_App.DataAccess.Concrete
{
    public class ReservationDal : GenericRepository<Reservation, RestaurantDbContext>, IReservationDal
    {
        public ReservationDal(RestaurantDbContext context) : base(context)
        {
        }
        public async Task<List<Reservation>> GetReservationsWithTables(int tableId)
        {
            return await _context.Reservations
                    .Include(r => r.Table)
                    .Where(r => r.TableId == tableId)
                    .ToListAsync();
        }
    }
}