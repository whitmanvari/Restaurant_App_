using Microsoft.EntityFrameworkCore;
using Restaurant_App.DataAccess.Abstract;
using Restaurant_App.DataAccess.Concrete.EfCore;
using Restaurant_App.Entities.Concrete;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Restaurant_App.DataAccess.Concrete
{
    public class ReservationDal : GenericRepository<Reservation, RestaurantDbContext>, IReservationDal
    {
        public async Task<List<Reservation>> GetReservationsWithTables(int tableId)
        {
            await using var context = new RestaurantDbContext();
            return await context.Reservations
                    .Include(r => r.Table)
                    .Where(r => r.TableId == tableId)
                    .ToListAsync();
        }
    }
}
