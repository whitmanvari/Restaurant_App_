using Restaurant_App.Entities.Concrete;

namespace Restaurant_App.DataAccess.Abstract
{
    public interface IProductDal: IRepository<Product>
    {
        
        Task<List<Product>> GetTopRatedProducts(Value minRatingValue, int count);
        Task<List<Product>> GetMostPopularProducts(int count);
        Task<List<Product>> SearchProducts(string searchTerm);
        Task<int> GetCountByCategory(string category);
        Task<Product> GetProductDetails(int id);
        Task<List<Product>> GetProductsByCategory(string category, int page, int pageSize);
        Task Update(Product entity, int[] categoryIds);
        
    }
}
