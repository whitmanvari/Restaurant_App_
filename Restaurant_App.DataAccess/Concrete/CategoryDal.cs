using Microsoft.EntityFrameworkCore;
using Restaurant_App.DataAccess.Abstract;
using Restaurant_App.DataAccess.Concrete.EfCore;
using Restaurant_App.Entities.Concrete;

namespace Restaurant_App.DataAccess.Concrete
{
    public class CategoryDal
        : GenericRepository<Category, RestaurantDbContext>, ICategoryDal
    {
        private readonly RestaurantDbContext _context;

        public CategoryDal(RestaurantDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task DeleteFromCategory(int categoryId, int productId)
        {
            var categoryProduct = await _context.ProductCategories
                .FirstOrDefaultAsync(pc => pc.CategoryId == categoryId && pc.ProductId == productId);

            if (categoryProduct == null)
                throw new Exception("Bu kategori ve ürün ilişkisi bulunamadı!");

            _context.ProductCategories.Remove(categoryProduct);
            await _context.SaveChangesAsync();
        }

        public async Task<Category> GetCategoryByIdWithProducts(int id)
        {
            var category = await _context.Categories
                .Include(c => c.Products)
                    .ThenInclude(p => p.Images)
                .FirstOrDefaultAsync(c => c.Id == id);

            return category ?? throw new Exception("Böyle bir kategori yok!");
        }

        public async Task<List<Category>> GetAllCategoriesWithProductId(int productId)
        {
            return await _context.Categories
                .Where(c => c.Products.Any(p => p.Id == productId))
                .Include(c => c.Products)
                    .ThenInclude(p => p.Images)
                .ToListAsync();
        }
    }
}
