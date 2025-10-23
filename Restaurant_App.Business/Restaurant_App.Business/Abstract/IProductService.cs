using Restaurant_App.Entities.Concrete;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Restaurant_App.Business.Abstract
{
    public interface IProductService
    {
        Task<List<Product>> GetTopRatedProducts(Value minRatingValue, int count);
        Task<List<Product>> GetMostPopularProducts(int count);
        Task<Product> GetProductDetails(int id);
        Task<List<Product>> SearchProducts(string searchTerm);
        Task<int> GetCountByCategory(string category);
        Task UpdateProduct(Product product, int[] categoryIds);
    }
}
