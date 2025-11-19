namespace Restaurant_App.Application.Dto
{
    public class ReservationDTO: BaseDTO
    {
        public string CustomerName { get; set; } = string.Empty;
        public string CustomerPhone { get; set; } = string.Empty;
        public string? CreatedBy { get; set; }
        public DateTime ReservationDate { get; set; }
        public int NumberOfGuests { get; set; }
        public int TableId { get; set; }
        public string? SpecialRequests { get; set; }
        public int Status { get; set; } // Enum integer olarak taşınır
        public string StatusName { get; set; } // Frontend'de kolay göstermek için (Onaylandı vs.)
    }
}
