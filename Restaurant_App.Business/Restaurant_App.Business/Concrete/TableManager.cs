using Restaurant_App.Business.Abstract;
using Restaurant_App.DataAccess.Abstract;
using Restaurant_App.Entities.Concrete;
using Restaurant_App.Entities.Enums;
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
            var candidateTables = await _tableDal.GetAvailableTables(reservationDate, numberOfGuests);
            // Çakışma Kontrolü(Business Logic)
            // Bir rezervasyon varsayılan olarak 2 saat sürer.
            // Eğer masanın rezervasyonları içinde, istenen saat ile çakışan varsa o masayı ele.

            var availableTables = new List<Table>();

            foreach (var table in candidateTables)
            {
                bool isOccupied = false;

                if (table.Reservations != null)
                {
                    foreach (var res in table.Reservations)
                    {
                        // Sadece ONAYLANMIŞ rezervasyonlar masayı kapatır
                        if (res.Status == ReservationStatus.Approved)
                        {
                            // Zaman Çakışması Kontrolü
                            // Mevcut Rezervasyon: [ResStart, ResEnd]
                            // İstenen Rezervasyon: [ReqStart, ReqEnd]
                            // Çakışma şartı: ResStart < ReqEnd && ResEnd > ReqStart

                            DateTime resStart = res.ReservationDate;
                            DateTime resEnd = res.ReservationDate.AddHours(2); // 2 saatlik oturum

                            DateTime reqStart = reservationDate;
                            DateTime reqEnd = reservationDate.AddHours(2);

                            if (resStart < reqEnd && resEnd > reqStart)
                            {
                                isOccupied = true;
                                break; // Çakışma bulundu, diğer rezervasyonlara bakmaya gerek yok
                            }
                        }
                    }
                }

                if (!isOccupied)
                {
                    availableTables.Add(table);
                }
            }

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
