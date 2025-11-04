using Restaurant_App.Entities.Concrete;

namespace Restaurant_App.DataAccess.Abstract
{
    public interface IReservationDal: IRepository<Reservation>
    {
        Task<List<Reservation>> GetReservationsWithTables(int tableId);
    }
}
