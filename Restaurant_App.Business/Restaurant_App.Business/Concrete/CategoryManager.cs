using Restaurant_App.Business.Abstract;
using Restaurant_App.DataAccess.Abstract;
using Restaurant_App.Entities.Concrete;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Restaurant_App.Business.Concrete
{
    public class CategoryManager: ICategoryService
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

        public async Task DeleteFromCategory(int categoryId, int productId)
        {
            await _categoryDal.DeleteFromCategory(categoryId, productId);
        }

        public async Task<List<Category>> GetAllCategoriesWithProductId(int productId)
        {
            return await _categoryDal.GetAllCategoriesWithProductId(productId);
        }

        public async Task<Category> GetCategoryByIdWithProducts(int id)
        {
            return await _categoryDal.GetCategoryByIdWithProducts(id);
        }

        public async Task Update(Category category)
        {
            await _categoryDal.Update(category);
        }
    }
}
