namespace Restaurant_App.WebAPI.Dto
{
    public class ReservationDTO: BaseDTO
    {
        public string? CustomerName { get; set; }
        public string? CustomerPhone { get; set; }
        public DateTime ReservationDate { get; set; }
        public int NumberOfGuests { get; set; }
        public int TableId { get; set; }
        public string? SpecialRequests { get; set; }
    }
}
