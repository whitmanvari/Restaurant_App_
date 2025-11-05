using Restaurant_App.Business.Abstract;
using Restaurant_App.DataAccess.Abstract;
using Restaurant_App.Entities.Concrete;
using Restaurant_App.Entities.Enums;
using System.Linq.Expressions;

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

        public async Task<List<Product>> GetTopRatedProducts(RatingValue minRatingValue, int count)
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
    }
}