using Restaurant_App.Entities.Concrete;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Restaurant_App.Business.Abstract
{
    public interface ITableService
    {
        Task<List<Table>> GetAvailableTables(DateTime reservationDate, int numberOfGuests);
        Task<Table?> GetTableWithReservations(int tableId);
        Task<Table?> GetTableWithOrders(int tableId);
        Task<List<Table>> GetAllTablesWithDetails();
        Task UpdateTableAvailability(int tableId, bool isAvailable);
        Task<int> GetAvailableTableCount();
        Task<int> GetTotalTableCount();
    }
}
