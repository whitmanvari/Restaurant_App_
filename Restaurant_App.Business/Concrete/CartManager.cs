using Restaurant_App.Business.Abstract;
using Restaurant_App.Entities.Concrete;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Restaurant_App.Business.Concrete
{
    public class CartManager : ICartService
    {
        private readonly ICartDal _cartDal;
        public Task ClearCart(int cartId)
        {
            throw new NotImplementedException();
        }

        public Task DeleteFromCart(int cartId, int productId)
        {
            throw new NotImplementedException();
        }

        public Task<Cart> GetCartByUserId(string userId)
        {
            throw new NotImplementedException();
        }
    }
}
