using Restaurant_App.Business.Abstract;
using Restaurant_App.DataAccess.Abstract;
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
        public CartManager(ICartDal cartDal)
        {
            _cartDal = cartDal; // Dependency Injection
        }

        public async Task AddToCart(string userId, int productId, int quantity)
        {
            var cart = await _cartDal.GetCartByUserId(userId);

            if (cart is not null)
            {
                var cartIndex = cart.CartItems.FindIndex(x => x.ProductId == productId);

                if (cartIndex < 0) // Eğer ürün sepette hiç yoksa sepete ürünü ekler
                {
                    cart.CartItems.Add(new CartItem
                    {
                        ProductId = productId,
                        Quantity = quantity,
                        CartId = cart.Id
                    });
                }
                else // Eğer ürün sepette varsa sepetteki ürünün sayısını arttırır.
                {
                    cart.CartItems[cartIndex].Quantity += quantity;
                }
            }

            await _cartDal.Update(cart); // DataAccess aracılığıyla sepeti günceller
        }

        public async Task<Cart> ClearCart(int cartId)
        {
            return await _cartDal.ClearCart(cartId);
        }

        public async Task DeleteFromCart(int cartId, int productId)
        {
            var cart = await _cartDal.GetCartById(cartId);
            if (cart is not null)
            {
                await _cartDal.DeleteFromCart(cart.Id, productId);
            }
        }

        public Task<Cart> GetCartById(int cartId)
        {
            return _cartDal.GetCartById(cartId);
        }

        public async Task<Cart> GetCartByUserId(string userId)
        {
            return await _cartDal.GetCartByUserId(userId);
        }

        public async Task InitialCart(string userId)
        {
            Cart cart = new()
            {
                UserId = userId
            };

            await _cartDal.Create(cart);
        }
    }
}
