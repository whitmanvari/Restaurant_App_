using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Restaurant_App.DataAccess.Abstract
{
    public interface ITableDal: IRepository<Table>
    {
        List<Table> GetAvailableTables(DateTime reservationDate, int numberOfGuests);
        Table GetTableWithReservations(int tableId);
        Table GetTableWithOrders(int tableId);
        List<Table> GetAllTablesWithDetails();
        void UpdateTableAvailability(int tableId, bool isAvailable);
        int GetAvailableTableCount();
        int GetTotalTableCount();

    }
}
