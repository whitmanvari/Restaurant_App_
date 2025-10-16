using Restaurant_App.Entities.Concrete;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Restaurant_App.DataAccess.Abstract
{
    public interface ICategoryDal: IRepository<Category>
    {
        void DeleteFromCategory(int categoryId, int productId);
        Category GetCategoryByIdWithProducts(int id);
    }
}
