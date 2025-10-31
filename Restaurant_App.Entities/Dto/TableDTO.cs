namespace Restaurant_App.Entities.Dto
{
    public class TableDTO: BaseDTO
    {
        public string? TableNumber { get; set; }
        public int Capacity { get; set; }
        public bool IsAvailable { get; set; }
    }
}
