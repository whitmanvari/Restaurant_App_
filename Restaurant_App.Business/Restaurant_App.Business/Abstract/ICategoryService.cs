using Restaurant_App.Entities.Concrete;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Restaurant_App.Business.Abstract
{
    public interface ICategoryService
    {
        Task<Category> GetCategoryByIdWithProducts(int id);
        Task<List<Category>> GetAllCategoriesWithProductId(int productId);
        Task DeleteFromCategory(int categoryId, int productId);
    }
}
