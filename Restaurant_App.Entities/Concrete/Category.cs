using Restaurant_App.Entities.Abstract;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Restaurant_App.Entities.Concrete
{
    [Table("Category")]
    public class Category: BaseEntity
    {
        public List<Product> Products { get; set; }
        public List<ProductCategory> ProductCategory { get; set; }
        public Category()
        {
            Products = new List<Product>();
            ProductCategory = new List<ProductCategory>();
        }
    }
}
