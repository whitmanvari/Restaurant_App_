using Restaurant_App.Entities.Abstract;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Restaurant_App.Entities.Concrete
{
    [Table("Image")]
    public class Image: BaseEntity
    {
        public string? ImageUrl { get; set; }
        public int ProductId { get; set; }
        public Product? Product { get; set; }
    }
}
