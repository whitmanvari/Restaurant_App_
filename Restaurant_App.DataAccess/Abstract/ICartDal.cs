using Restaurant_App.Entities.Concrete;

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
