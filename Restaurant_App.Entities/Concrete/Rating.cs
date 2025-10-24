using Restaurant_App.Entities.Abstract;

namespace Restaurant_App.Entities.Concrete
{
    public class Rating: BaseEntity
    {
        public Value Value { get; set; }
        public string UserId { get; set; }
        public double AverageRating { get; set; }
        public Product MostValuableProduct { get; set; }
        public int MostValuableProductId { get; set; }

        public Product LeastValuableProduct { get; set; }
        public int LeastValuableProductId { get; set; }
        public List<Comment> Comments { get; set; }
        public Product Product { get; set; }
        public int ProductId { get; set; }
        public Rating()
        {
            Comments = new List<Comment>(); // Rating oluşturulduğunda Comments listesi de başlatılır
        }
        public double GetNumericValue()
        {
            return (double)Value;
        }
    }
    public enum Value
    {
        One = 1,
        Two = 2,
        Three = 3,
        Four = 4,
        Five = 5
    }
}
