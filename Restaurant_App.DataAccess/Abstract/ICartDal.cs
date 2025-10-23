using Restaurant_App.Entities.Concrete;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Restaurant_App.DataAccess.Abstract
{
    public interface ICartDal: IRepository<Cart> 
    {
        Task<Cart> ClearCart(int cartId);
        Task DeleteFromCart(int cartId, int productId);
        Task<Cart> GetCartByUserId(string userId);
        Task<Cart> GetCartById(int cartId);
    }
}
