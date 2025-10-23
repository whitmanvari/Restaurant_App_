using Microsoft.EntityFrameworkCore;
using Restaurant_App.DataAccess.Abstract;
using Restaurant_App.DataAccess.Concrete.EfCore;
using Restaurant_App.Entities.Concrete;

namespace Restaurant_App.DataAccess.Concrete
{ 
    public class CartDal : GenericRepository<Cart, RestaurantDbContext>, ICartDal
    {
        //Sepetteki tüm ürünleri siler.
        public async Task<Cart> ClearCart(int cartId)
        {
            await using var _context = new RestaurantDbContext();
            var cart = await _context.Carts
                .Include(c => c.CartItems)
                .FirstOrDefaultAsync(c => c.Id == cartId)
                ?? throw new ArgumentNullException("Böyle bir sepet yok!");
            _context.CartItems.RemoveRange(cart.CartItems);
            await _context.SaveChangesAsync();
            return cart;
        }

        public async Task DeleteFromCart(int cartId, int productId)
        {
            await using RestaurantDbContext _context = new();
            var cartItem = await _context.CartItems
                .FirstOrDefaultAsync(ci => ci.CartId == cartId && ci.ProductId == productId);
            if(cartItem == null)
            {
                throw new ArgumentNullException("Böyle bir ürüne sahip sepet bulunamadı!");
            }
            _context.CartItems.Remove(cartItem);
            await _context.SaveChangesAsync();
        }

        public async Task<Cart> GetCartById(int cartId)
        {
            await using var _context = new RestaurantDbContext();
            var cart = await _context.Carts
                .Include(c => c.CartItems)
                    .ThenInclude(ci => ci.Product)
                .FirstOrDefaultAsync(c => c.Id == cartId);
            if(cart==null) { throw new ArgumentNullException("Böyle bir sepet yok!"); }
            return cart;
        }

        public async Task<Cart> GetCartByUserId(string userId)
        {
            await using var _context = new RestaurantDbContext();

            var cart = await _context.Carts
                .Include(c => c.CartItems)
                    .ThenInclude(ci => ci.Product)
                .FirstOrDefaultAsync(c=> c.UserId == userId);
            if(cart == null)
            {
                cart = new Cart { UserId = userId };
                await _context.Carts.AddAsync(cart);
                await _context.SaveChangesAsync();
            }
            return cart;
        }
    }
}
