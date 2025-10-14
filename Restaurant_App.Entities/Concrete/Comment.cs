using Restaurant_App.Entities.Abstract;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Restaurant_App.Entities.Concrete
{
    public class Comment: BaseEntity
    {
        public string Text { get; set; }
        public Rating Rating { get; set; }
        public int RatingId { get; set; } 
        public string UserId { get; set; }
    }
}
