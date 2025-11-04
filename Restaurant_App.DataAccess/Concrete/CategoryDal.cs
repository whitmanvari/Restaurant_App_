using Microsoft.EntityFrameworkCore;
using Restaurant_App.DataAccess.Abstract;
using Restaurant_App.DataAccess.Concrete.EfCore;
using Restaurant_App.Entities.Concrete;
namespace Restaurant_App.DataAccess.Concrete
{
    public class CategoryDal
        : GenericRepository<Category, RestaurantDbContext>, ICategoryDal
    {
        public CategoryDal(RestaurantDbContext context) : base(context)
        {
        }

        public async Task<Category> GetCategoryByIdWithProducts(int id)
        {
            var category = await _context.Categories
                .Include(c => c.Products)
                    .ThenInclude(p => p.Images)
                .FirstOrDefaultAsync(c => c.Id == id);

            return category ?? throw new Exception("Böyle bir kategori yok!");
        }
    }
}