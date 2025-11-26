using Restaurant_App.Entities.Concrete;
using Restaurant_App.Entities.Enums;

namespace Restaurant_App.DataAccess.Abstract
{
    public interface IProductDal: IRepository<Product>
    {
        Task<List<Product>> GetTopRatedProducts(RatingValue minRatingValue, int count);
        Task<List<Product>> GetMostPopularProducts(int count);
        Task<List<Product>> SearchProducts(string searchTerm);
        Task<int> GetCountByCategory(string category);
        Task<Product> GetProductDetails(int id);
        Task<List<Product>> GetProductsByCategory(string category, int page, int pageSize);
        Task<List<Product>> GetAllWithDetails(); //Tüm detayları, resim kategori vs ile getir.
    }
}
