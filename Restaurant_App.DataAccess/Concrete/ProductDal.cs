using Restaurant_App.DataAccess.Abstract;
using Restaurant_App.DataAccess.Concrete.EfCore;
using Restaurant_App.Entities.Concrete;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Restaurant_App.DataAccess.Concrete
{
    public class ProductDal : GenericRepository<Product, RestaurantDbContext>, IProductDal
    {
        public int GetCountByCategory(string category)
        {
        }

        public List<Product> GetMostPopularProducts(Rating rating, int count)
        {
        }

        public Product GetProductDetails(int id)
        {
            throw new NotImplementedException();
        }

        public List<Product> GetProductsByCategory(string category, int page, int pageSize)
        {
            throw new NotImplementedException();
        }

        public List<Product> GetTopRatedProducts(Rating rating, int count)
        {
            throw new NotImplementedException();
        }

        public List<Product> SearchProducts(string searchTerm)
        {
            throw new NotImplementedException();
        }

        public void Update(Product entity, int[] categoryIds)
        {
            throw new NotImplementedException();
        }
    }
}
