using Restaurant_App.Entities.Concrete;

namespace Restaurant_App.DataAccess.Abstract
{
    public interface ICategoryDal: IRepository<Category>
    {
        Task<Category> GetCategoryByIdWithProducts(int id);
    }
}
