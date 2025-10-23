using Restaurant_App.Business.Abstract;
using Restaurant_App.DataAccess.Abstract;
using Restaurant_App.DataAccess.Concrete;
using Restaurant_App.Entities.Concrete;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Restaurant_App.Business.Concrete
{
    public class ProductManager : IProductService, IService<Product>

    {
        private readonly IProductDal _productDal;
        public ProductManager(IProductDal productDal)
        {
            _productDal = productDal;
        }

        public async Task Create(Product entity)
        {
            await _productDal.Create(entity);
        }

        public async Task Delete(Product entity)
        {
            await _productDal.Delete(entity);
        }

        public async Task<List<Product>> GetAll(Expression<Func<Product, bool>>? filter = null)
        {
            return await _productDal.GetAll(filter);
        }

        public async Task<Product> GetById(int id)
        {
            return await _productDal.GetById(id);
        }

        public async Task<int> GetCountByCategory(string category)
        {
            return await _productDal.GetCountByCategory(category);
        }

        public async Task<List<Product>> GetMostPopularProducts(int count)
        {
            return await _productDal.GetMostPopularProducts(count);
        }

        public async Task<Product> GetOne(Expression<Func<Product, bool>>? filter = null)
        {
            return await _productDal.GetOne(filter);
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

        public async Task Update(Product entity)
        {
            await _productDal.Update(entity);
        }

        public Task UpdateProduct(Product product, int[] categoryIds)
        {
            return _productDal.Update(product, categoryIds);
        }
    }
}
