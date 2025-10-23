using Restaurant_App.Business.Abstract;
using Restaurant_App.DataAccess.Abstract;
using Restaurant_App.Entities.Concrete;
using System.Linq.Expressions;

namespace Restaurant_App.Business.Concrete
{
    public class TableManager: ITableService, IService<Table>
    {
        private readonly ITableDal _tableDal;

        public TableManager(ITableDal tableDal)
        {
            _tableDal = tableDal;
        }

        public async Task Create(Table entity)
        {
            await _tableDal.Create(entity);
        }

        public async Task Delete(Table entity)
        {
            await _tableDal.Delete(entity);
        }

        public async Task<List<Table>> GetAll(Expression<Func<Table, bool>>? filter = null)
        {
            return await _tableDal.GetAll(filter);
        }

        public async Task<List<Table>> GetAvailableTables(DateTime reservationDate, int numberOfGuests)
        {
            return await _tableDal.GetAvailableTables(reservationDate, numberOfGuests);
        }

        public async Task<Table?> GetTableWithReservations(int tableId)
        {
            return await _tableDal.GetTableWithReservations(tableId);
        }

        public async Task<Table?> GetTableWithOrders(int tableId)
        {
            return await _tableDal.GetTableWithOrders(tableId);
        }

        public async Task<List<Table>> GetAllTablesWithDetails()
        {
            return await _tableDal.GetAllTablesWithDetails();
        }

        public async Task UpdateTableAvailability(int tableId, bool isAvailable)
        {
            await _tableDal.UpdateTableAvailability(tableId, isAvailable);
        }

        public async Task<int> GetAvailableTableCount()
        {
            return await _tableDal.GetAvailableTableCount();
        }

        public async Task<int> GetTotalTableCount()
        {
            return await _tableDal.GetTotalTableCount();
        }
    }
}
