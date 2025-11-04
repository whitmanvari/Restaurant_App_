using Restaurant_App.Entities.Concrete;

namespace Restaurant_App.Business.Abstract
{
    public interface ICategoryService: IService<Category>
    {
        Task<Category> GetCategoryByIdWithProducts(int id);
        Task<List<Category>> GetAllCategoriesWithProductId(int productId);
    }
}
