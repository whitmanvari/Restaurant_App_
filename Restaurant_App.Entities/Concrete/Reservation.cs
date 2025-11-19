using Restaurant_App.Entities.Abstract;
using Restaurant_App.Entities.Enums;
using System.ComponentModel.DataAnnotations.Schema;

namespace Restaurant_App.Entities.Concrete
{
    [Table("Reservations")]
    public class Reservation: BaseEntity
    {
        public string CustomerName { get; set; }
        public string? CreatedBy { get; set; }
        public string CustomerPhone { get; set; }
        public DateTime ReservationDate { get; set; }
        public int NumberOfGuests { get; set; }
        public int TableId { get; set; }
        public Table? Table { get; set; }
        public string? SpecialRequests { get; set; }
        public ReservationStatus Status { get; set; } = ReservationStatus.Pending;
        public Reservation()
        {
            ReservationDate = DateTime.Now;
        }
    }
}
