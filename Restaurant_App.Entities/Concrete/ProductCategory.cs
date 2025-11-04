using Restaurant_App.Entities.Abstract;
using System.ComponentModel.DataAnnotations.Schema;

namespace Restaurant_App.Entities.Concrete
{
    [Table("ProductCategories")]
    public class ProductCategory: BaseEntity
    {
        public int ProductId { get; set; }
        public Product? Product { get; set; }
        public int CategoryId { get; set; }
        public Category? Category { get; set; }
    }
}
