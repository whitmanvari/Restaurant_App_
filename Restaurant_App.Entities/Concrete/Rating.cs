using Restaurant_App.Entities.Abstract;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Restaurant_App.Entities.Concrete
{
    public class Rating: BaseEntity
    {
        public Value Value { get; set; }
        public string UserId { get; set; }
        public double AverageRating { get; set; }
        public Product MostValuableProduct { get; set; }
        public Product LeastValuableProduct { get; set; }
        public List<Comment> Comments { get; set; }
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
