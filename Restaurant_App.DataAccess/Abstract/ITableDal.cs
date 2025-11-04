using Restaurant_App.Entities.Concrete;

namespace Restaurant_App.DataAccess.Abstract
{
    public interface ITableDal: IRepository<Table>
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
