using Restaurant_App.Entities.Abstract;
using System.ComponentModel.DataAnnotations.Schema;

namespace Restaurant_App.Entities.Concrete
{
    [Table("Categories")]
    public class Category: BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public List<Product> Products { get; set; } = new List<Product>();
    }
}
