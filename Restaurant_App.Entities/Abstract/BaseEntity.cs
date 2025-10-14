using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Restaurant_App.Entities.Abstract
{
    public abstract class BaseEntity
    {
        public int Id { get; set; }
        public string? Name { get; set; }   
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
    }
}
