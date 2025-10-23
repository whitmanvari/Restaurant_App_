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
        Task<Cart> GetCartById(int cartId);
        Task<Cart> ClearCart(int cartId);
        Task DeleteFromCart(int cartId, int productId);
        Task InitialCart(string userId);
        Task AddToCart(string userId, int productId, int quantity);
        Task UpdateCart(Cart cart);

    }
}
