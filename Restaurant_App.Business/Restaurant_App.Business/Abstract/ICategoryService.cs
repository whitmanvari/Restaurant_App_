using Restaurant_App.Entities.Concrete;

namespace Restaurant_App.Business.Abstract
{
    public interface ICategoryService
    {
        Task<Category> GetCategoryByIdWithProducts(int id);
        Task<List<Category>> GetAllCategoriesWithProductId(int productId);
        Task DeleteFromCategory(int categoryId, int productId);
       
    }
}
