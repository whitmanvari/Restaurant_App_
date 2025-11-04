using Restaurant_App.Entities.Concrete;
using Restaurant_App.Entities.Enum;

namespace Restaurant_App.Business.Abstract
{
    public interface IProductService: IService<Product>
    {
        Task<List<Product>> GetTopRatedProducts(RatingValue minRatingValue, int count);
        Task<List<Product>> GetMostPopularProducts(int count);
        Task<Product> GetProductDetails(int id);
        Task<List<Product>> SearchProducts(string searchTerm);
        Task<int> GetCountByCategory(string category);
    }
}
