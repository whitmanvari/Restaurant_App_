using Restaurant_App.Business.Abstract;
using Restaurant_App.DataAccess.Abstract;
using Restaurant_App.Entities.Concrete;
using System.Linq.Expressions;

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

            // Sepet yoksa oluştur (CartDal içinde bu logic var ama burada da double check)
            if (cart == null)
            {
                await InitialCart(userId);
                cart = await _cartDal.GetCartByUserId(userId);
            }

            var existingItem = cart.CartItems.FirstOrDefault(x => x.ProductId == productId);

            if (existingItem != null)
            {
                existingItem.Quantity += quantity;
            }
            else
            {
                cart.CartItems.Add(new CartItem
                {
                    ProductId = productId,
                    Quantity = quantity,
                    CartId = cart.Id
                });
            }

            await _cartDal.Update(cart);
        }

        public async Task<Cart> ClearCart(int cartId)
        {
            return await _cartDal.ClearCart(cartId);
        }

        public async Task Create(Cart entity)
        {
            await _cartDal.Create(entity);
        }

        public async Task Delete(Cart entity)
        {
            await _cartDal.Delete(entity);
        }

        public async Task DeleteFromCart(int cartId, int productId)
        {
            var cart = await _cartDal.GetCartById(cartId);
            if (cart is not null)
            {
                await _cartDal.DeleteFromCart(cart.Id, productId);
            }
        }

        public async Task<List<Cart>> GetAll(Expression<Func<Cart, bool>>? filter = null)
        {
            return await _cartDal.GetAll(filter);
        }

        public async Task<Cart> GetById(int id)
        {
            return await _cartDal.GetById(id);
        }

        public async Task<Cart> GetCartById(int cartId)
        {
            return await _cartDal.GetCartById(cartId);
        }

        public async Task<Cart> GetCartByUserId(string userId)
        {
            return await _cartDal.GetCartByUserId(userId);
        }

        public async Task<Cart> GetOne(Expression<Func<Cart, bool>>? filter = null)
        {
            return await _cartDal.GetOne(filter);   
        }

        public async Task InitialCart(string userId)
        {
            Cart cart = new()
            {
                UserId = userId
            };

            await _cartDal.Create(cart);
        }

        public async Task Update(Cart entity)
        {
            await _cartDal.Update(entity);
        }

    }
}
