using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Restaurant_App.DataAccess.Abstract;
using Restaurant_App.DataAccess.Concrete.EfCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Restaurant_App.DataAccess.Concrete
{
    public class TableDal : GenericRepository<Table, RestaurantDbContext>, ITableDal
    {
        public List<Table> GetAllTablesWithDetails()
        {
            throw new NotImplementedException();
        }

        public int GetAvailableTableCount()
        {
            throw new NotImplementedException();
        }

        public List<Table> GetAvailableTables(DateTime reservationDate, int numberOfGuests)
        {
            throw new NotImplementedException();
        }

        public Table GetTableWithOrders(int tableId)
        {
            throw new NotImplementedException();
        }

        public Table GetTableWithReservations(int tableId)
        {
            throw new NotImplementedException();
        }

        public int GetTotalTableCount()
        {
            throw new NotImplementedException();
        }

        public void UpdateTableAvailability(int tableId, bool isAvailable)
        {
            throw new NotImplementedException();
        }
    }
}
