using Restaurant_App.Business.Abstract;
using Restaurant_App.DataAccess.Abstract;
using Restaurant_App.Entities.Concrete;
using System.Linq.Expressions;

namespace Restaurant_App.Business.Concrete
{
    public class ReservationManager : IReservationService, IService<Reservation>
    {
        private readonly IReservationDal _reservationDal;

        public ReservationManager(IReservationDal reservationDal)
        {
            _reservationDal = reservationDal;
        }
        public async Task Create(Reservation entity)
        {
            await _reservationDal.Create(entity);
        }

        public async Task Delete(Reservation entity)
        {
            await _reservationDal.Delete(entity);
        }

        public async Task<List<Reservation>> GetAll(Expression<Func<Reservation, bool>>? filter = null)
        {
            return await _reservationDal.GetAll(filter);
        }

        public async Task<Reservation> GetById(int id)
        {
            return await _reservationDal.GetById(id);
        }

        public async Task<Reservation> GetOne(Expression<Func<Reservation, bool>>? filter = null)
        {
            return await _reservationDal.GetOne(filter);
        }

        public async Task<List<Reservation>> GetReservationsWithTables(int tableId)
        {
            return await _reservationDal.GetReservationsWithTables(tableId);
        }

        public async Task Update(Reservation entity)
        {
            await _reservationDal.Update(entity);
        }
    }
}