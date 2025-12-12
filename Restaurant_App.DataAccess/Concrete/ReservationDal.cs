using Microsoft.EntityFrameworkCore;
using Restaurant_App.DataAccess.Abstract;
using Restaurant_App.DataAccess.Concrete.EfCore;
using Restaurant_App.Entities.Concrete;
using System.Linq.Expressions;

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
        // Admin panelindeki liste için ve "Rezervasyonlarım" için bu çalışır
        public override async Task<List<Reservation>> GetAll(Expression<Func<Reservation, bool>>? filter = null)
        {
            var query = _context.Reservations
                .Include(r => r.User) 
                .Include(r => r.Table) 
                .AsQueryable();

            if (filter != null)
            {
                query = query.Where(filter);
            }

            return await query.ToListAsync();
        }
    }
}