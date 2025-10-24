using Restaurant_App.Entities.Abstract;

namespace Restaurant_App.Entities.Concrete
{
    public class Reservation: BaseEntity
    {
        public string CustomerName { get; set; }
        public string CustomerPhone { get; set; }
        public DateTime ReservationDate { get; set; }
        public int NumberOfGuests { get; set; }
        public int TableId { get; set; }
        public Table? Table { get; set; }
        public string? SpecialRequests { get; set; }
        public Reservation()
        {
            ReservationDate = DateTime.Now;
        }

    }
}
