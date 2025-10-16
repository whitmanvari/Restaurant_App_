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
        List<Product> GetTopRatedProducts(Rating rating, int count);
        List<Product> GetMostPopularProducts(Rating rating, int count);
        List<Product> SearchProducts(string searchTerm);
        int GetCountByCategory(string category);
        Product GetProductDetails(int id);
        List<Product> GetProductsByCategory(string category, int page, int pageSize);
        void Update(Product entity, int[] categoryIds);
    }
}
