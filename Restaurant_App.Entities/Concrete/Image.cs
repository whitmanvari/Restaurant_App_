using Restaurant_App.Entities.Abstract;
using System.ComponentModel.DataAnnotations.Schema;

namespace Restaurant_App.Entities.Concrete
{
    [Table("Images")]
    public class Image : BaseEntity
    {
        public string? Images { get; set; }
        public int ProductId { get; set; }
        public Product? Product { get; set; }
    }
}
