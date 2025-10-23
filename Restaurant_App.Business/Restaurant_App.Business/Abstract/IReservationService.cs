using Restaurant_App.Entities.Concrete;

namespace Restaurant_App.Business.Abstract
{
    public interface IReservationService
    {
        Task<List<Reservation>> GetReservationsWithTables(int tableId);
    }
}
