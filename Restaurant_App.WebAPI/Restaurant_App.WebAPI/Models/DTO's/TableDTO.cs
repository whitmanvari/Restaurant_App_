namespace Restaurant_App.WebAPI.Models.DTO_s
{
    public class TableDTO
    {
        public int Id { get; set; }
        public string? TableNumber { get; set; }
        public int Capacity { get; set; }
        public bool IsAvailable { get; set; }
    }
}
