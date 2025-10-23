using Restaurant_App.Business.Abstract;
using Restaurant_App.DataAccess.Abstract;
using Restaurant_App.DataAccess.Concrete;
using Restaurant_App.Entities.Concrete;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Restaurant_App.Business.Concrete
{
    public class ProductManager : IProductService

    {
        private readonly IProductDal _productDal;
        public ProductManager(IProductDal productDal)
        {
            _productDal = productDal;
        }
        public async Task<int> GetCountByCategory(string category)
        {
            return await _productDal.GetCountByCategory(category);
        }

        public async Task<List<Product>> GetMostPopularProducts(int count)
        {
            return await _productDal.GetMostPopularProducts(count);
        }

        public async Task<Product> GetProductDetails(int id)
        {
            return await _productDal.GetProductDetails(id);
        }

        public async Task<List<Product>> GetTopRatedProducts(Value minRatingValue, int count)
        {
            return await _productDal.GetTopRatedProducts(minRatingValue, count);
        }

        public async Task<List<Product>> SearchProducts(string searchTerm)
        {
            return await _productDal.SearchProducts(searchTerm);
        }

        public async Task UpdateProduct(Product product, int[] categoryIds)
        {
            await _productDal.Update(product, categoryIds);
        }
    }
}
