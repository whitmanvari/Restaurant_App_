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
            // ... (1. Tüm fiziksel olarak uygun masaları çekme) ...
            var candidateTables = await _tableDal.GetAvailableTables(reservationDate, numberOfGuests);

            // 2. Çakışan Rezervasyonları Bularak ID'lerini Listele
            var startTime = reservationDate.AddMinutes(-10);
            var endTime = reservationDate.AddHours(2);

            // DEBUG M1: Hesaplanan zaman aralığını yazdır
            Console.WriteLine($"[DEBUG M1] Manager GİREN Sorgu Tarihi: {reservationDate}");
            Console.WriteLine($"[DEBUG M2] Filtre Başlangıç Aralığı: {startTime}");
            Console.WriteLine($"[DEBUG M3] Filtre Bitiş Aralığı: {endTime}");

            var reservations = await _reservationDal.GetAll(r =>
                (r.Status == ReservationStatus.Approved || r.Status == ReservationStatus.Pending) &&
                r.ReservationDate < endTime &&
                r.ReservationDate.AddHours(2) > startTime
            );
            // DEBUG M4: Bulunan çakışan rezervasyon sayısını ve ilk rezervasyonun DB saatini yazdır
            Console.WriteLine($"[DEBUG M4] Çakışan Toplam Rezervasyon Sayısı: {reservations.Count}");
            if (reservations.Any())
            {
                Console.WriteLine($"[DEBUG M5] İlk Çakışan DB Kayıt Tarihi: {reservations.First().ReservationDate}");
            }

            // 3. Rezerve edilmiş masaların ID'lerini listele
            var reservedTableIds = reservations
                .Where(r => r.TableId.HasValue)
                .Select(r => r.TableId.Value)
                .ToList();

            // 4. Çakışanları listeden çıkar
            var availableTables = candidateTables.Where(t => !reservedTableIds.Contains(t.Id)).ToList();
            // DEBUG M6: Nihai Müsait Masa Sayısını yazdır
            Console.WriteLine($"[DEBUG M6] Nihai Müsait Masa Sayısı: {availableTables.Count}");

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
