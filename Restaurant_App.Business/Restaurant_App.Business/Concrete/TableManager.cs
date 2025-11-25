using Restaurant_App.Business.Abstract;
using Restaurant_App.DataAccess.Abstract;
using Restaurant_App.DataAccess.Concrete;
using Restaurant_App.Entities.Concrete;
using Restaurant_App.Entities.Enums;
using System.Linq.Expressions;

namespace Restaurant_App.Business.Concrete
{
    public class TableManager : ITableService, IService<Table>
    {
        private readonly ITableDal _tableDal;
        private readonly IReservationDal _reservationDal;

        public TableManager(ITableDal tableDal, IReservationDal reservationDal)
        {
            _tableDal = tableDal;
            _reservationDal = reservationDal;
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
            // 1. Tüm fiziksel olarak uygun masaları çek
            var candidateTables = await _tableDal.GetAvailableTables(reservationDate, numberOfGuests);

            // 2. Çakışan Rezervasyonları Bularak ID'lerini Listele
            var startTime = reservationDate.AddMinutes(-10);
            var endTime = reservationDate.AddHours(2);

            var reservations = await _reservationDal.GetAll(r =>
                r.Status == ReservationStatus.Approved &&
                r.ReservationDate < endTime &&
                r.ReservationDate.AddHours(2) > startTime
            );

            // 3. Rezerve edilmiş masaların ID'lerini listele
            var reservedTableIds = reservations
                .Where(r => r.TableId.HasValue) // Sadece değeri olanları al
                .Select(r => r.TableId.Value) // Değeri olanların Value'sunu (int) al
                .ToList();

            // 4. Çakışanları listeden çıkar
            var availableTables = candidateTables.Where(t => !reservedTableIds.Contains(t.Id)).ToList();

            return availableTables;
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

        public async Task<Table> GetById(int id)
        {
            return await _tableDal.GetById(id);
        }

        public async Task<Table> GetOne(Expression<Func<Table, bool>>? filter = null)
        {
            return await _tableDal.GetOne(filter);
        }

        public async Task Update(Table entity)
        {
            await _tableDal.Update(entity);
        }
    }
}
