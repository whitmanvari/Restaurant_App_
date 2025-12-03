using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Restaurant_App.Entities.Concrete
{
    public class StatusUpdateModel
    {
        public int Id { get; set; }
        public string Status { get; set; } = string.Empty;
    }
}
