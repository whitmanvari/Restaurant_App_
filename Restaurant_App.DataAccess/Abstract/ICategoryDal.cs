using Restaurant_App.Entities.Concrete;

namespace Restaurant_App.DataAccess.Abstract
{
    public interface ICategoryDal: IRepository<Category>
    {
        Task DeleteFromCategory(int categoryId, int productId);
        Task<Category> GetCategoryByIdWithProducts(int id);
        Task<List<Category>> GetAllCategoriesWithProductId(int productId);
    }
}
