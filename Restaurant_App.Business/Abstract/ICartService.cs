using Restaurant_App.Entities.Concrete;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Restaurant_App.Business.Abstract
{
    public interface ICartService
    {
        Task<Cart> GetCartByUserId(string userId);
        Task ClearCart(int cartId);
        Task DeleteFromCart(int cartId, int productId);
    }
}
