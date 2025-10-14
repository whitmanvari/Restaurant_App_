using Restaurant_App.Entities.Abstract;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Restaurant_App.Entities.Concrete
{
    [Table("Cart Item")]
    public class CartItem: BaseEntity
    {
        public int ProductId { get; set; }
        public Product? Product { get; set; }
        public int Quantity { get; set; }
        public int CartId { get; set; }
        public Cart? Cart { get; set; }
        public double TotalPrice { get; set; } = 0;

    }
}
