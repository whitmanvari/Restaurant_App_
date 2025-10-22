using Restaurant_App.DataAccess.Abstract;
using Restaurant_App.DataAccess.Concrete.EfCore;
using Restaurant_App.Entities.Concrete;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Restaurant_App.DataAccess.Concrete
{
    public class CategoryDal : GenericRepository<Category, RestaurantDbContext>, ICategoryDal
    {
        public void DeleteFromCategory(int categoryId, int productId)
        {
            throw new NotImplementedException();
        }

        public Category GetCategoryByIdWithProducts(int id)
        {
            throw new NotImplementedException();
        }
    }
}
