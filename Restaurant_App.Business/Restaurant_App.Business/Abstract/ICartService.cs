using Restaurant_App.Entities.Concrete;

namespace Restaurant_App.Business.Abstract
{
    public interface ICartService: IService<Cart>
    {
        Task<Cart> GetCartByUserId(string userId);
        Task<Cart> GetCartById(int cartId);
        Task<Cart> ClearCart(int cartId);
        Task DeleteFromCart(int cartId, int productId);
        Task InitialCart(string userId);
        Task AddToCart(string userId, int productId, int quantity);
    }
}
