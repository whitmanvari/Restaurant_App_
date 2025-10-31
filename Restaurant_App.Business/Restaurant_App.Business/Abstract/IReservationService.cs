using Restaurant_App.Entities.Concrete;

namespace Restaurant_App.Business.Abstract
{
    public interface IReservationService: IService<Reservation>
    {
        Task<List<Reservation>> GetReservationsWithTables(int tableId);
    }
}
