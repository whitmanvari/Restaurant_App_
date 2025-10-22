using Restaurant_App.Entities.Concrete;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Restaurant_App.DataAccess.Abstract
{
    public interface IProductDal: IRepository<Product>
    {
        
        Task<List<Product>> GetTopRatedProducts(Rating rating, int count);
        Task<List<Product>> GetMostPopularProducts(Rating rating, int count);
        Task<List<Product>> SearchProducts(string searchTerm);
        Task<int> GetCountByCategory(string category);
        Task<Product> GetProductDetails(int id);
        Task<List<Product>> GetProductsByCategory(string category, int page, int pageSize);
        Task Update(Product entity, int[] categoryIds);
        
    }
}
