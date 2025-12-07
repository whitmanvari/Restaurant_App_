using Microsoft.EntityFrameworkCore;
using Restaurant_App.DataAccess.Abstract;
using Restaurant_App.DataAccess.Concrete.EfCore;
using Restaurant_App.Entities.Concrete;

namespace Restaurant_App.DataAccess.Concrete
{
    public class CartDal : GenericRepository<Cart, RestaurantDbContext>, ICartDal
    {
        public CartDal(RestaurantDbContext context) : base(context)
        {
        }

        public async Task<Cart> ClearCart(int cartId)
        {
            var cart = await _context.Carts
                .Include(c => c.CartItems)
                .FirstOrDefaultAsync(c => c.Id == cartId);

            if (cart != null && cart.CartItems != null)
            {
                _context.CartItems.RemoveRange(cart.CartItems);
                await _context.SaveChangesAsync();
                return cart;
            }
            throw new Exception("Sepet bulunamadı.");
        }

        public async Task DeleteFromCart(int cartId, int productId)
        {
            var cartItem = await _context.CartItems
                .FirstOrDefaultAsync(ci => ci.CartId == cartId && ci.ProductId == productId);

            if (cartItem != null)
            {
                _context.CartItems.Remove(cartItem);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<Cart> GetCartById(int cartId)
        {
            var cart = await _context.Carts
                .Include(c => c.CartItems)
                    .ThenInclude(ci => ci.Product)
                        .ThenInclude(p => p.Images) // Resimleri Çek
                .AsSplitQuery() // Performans ve Hata Önleyici
                .FirstOrDefaultAsync(c => c.Id == cartId);

            return cart ?? throw new Exception("Sepet bulunamadı!");
        }

        public async Task<Cart> GetCartByUserId(string userId)
        {
            var cart = await _context.Carts
                .Include(c => c.CartItems)
                    .ThenInclude(ci => ci.Product)
                        .ThenInclude(p => p.Images) // Resimleri Çek
                .AsSplitQuery() // Performans ve Hata Önleyici
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null)
            {
                cart = new Cart { UserId = userId };
                await _context.Carts.AddAsync(cart);
                await _context.SaveChangesAsync();
            }
            return cart;
        }
    }
}