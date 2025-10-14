using Restaurant_App.Entities.Abstract;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Restaurant_App.Entities.Concrete
{
    [Table("Cart")]
    public class Cart: BaseEntity
    {
        public string? UserId { get; set; }
        public List<CartItem> CartItems { get; set; }

        public Cart()
        {
            CartItems = new List<CartItem>();
        }

    }
}
