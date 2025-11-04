using Restaurant_App.Business.Abstract;
using Restaurant_App.DataAccess.Abstract;
using Restaurant_App.Entities.Concrete;
using System.Linq.Expressions;

namespace Restaurant_App.Business.Concrete
{
    public class CategoryManager : ICategoryService, IService<Category>
    {
        private readonly ICategoryDal _categoryDal;
        public CategoryManager(ICategoryDal categoryDal)
        {
            _categoryDal = categoryDal;
        }

        public async Task Create(Category category)
        {
            await _categoryDal.Create(category);
        }

        public async Task Delete(Category category)
        {
            await _categoryDal.Delete(category);
        }

        public async Task<List<Category>> GetAll(Expression<Func<Category, bool>>? filter = null)
        {
            return await _categoryDal.GetAll(filter);
        }

        public async Task<List<Category>> GetAllCategoriesWithProductId(int productId)
        {
            return await _categoryDal.GetAll(c => c.Products.Any(p => p.Id == productId));
        }

        public async Task<Category> GetById(int id)
        {
            return await _categoryDal.GetById(id);
        }

        public async Task<Category> GetCategoryByIdWithProducts(int id)
        {
            return await _categoryDal.GetCategoryByIdWithProducts(id);
        }

        public async Task<Category> GetOne(Expression<Func<Category, bool>>? filter = null)
        {
            return await _categoryDal.GetOne(filter);
        }

        public async Task Update(Category category)
        {
            await _categoryDal.Update(category);
        }
    }
}