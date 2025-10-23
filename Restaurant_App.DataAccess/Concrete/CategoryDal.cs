using Microsoft.EntityFrameworkCore;
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
        public async Task DeleteFromCategory(int categoryId, int productId)
        {
            await using var _context = new RestaurantDbContext();

            var categoryProduct = await _context.ProductCategories
                .FirstOrDefaultAsync(pc => pc.CategoryId == categoryId && pc.ProductId == productId);

            if (categoryProduct != null)
            {
                _context.ProductCategories.Remove(categoryProduct);
                await _context.SaveChangesAsync();
            }
            else
            {
                throw new ArgumentNullException("Bu kategori ve ürün ilişkisi bulunamadı!");
            }
        }

        public async Task<Category> GetCategoryByIdWithProducts(int id)
        {
            await using var _context = new RestaurantDbContext();
            var category = await _context.Categories
                .Include(c => c.Products)
                    .ThenInclude(p=>p.Images)
                .FirstOrDefaultAsync(c => c.Id == id);

            return category ?? throw new ArgumentNullException("Böyle bir kategori yok!");

        }
        public async Task<List<Category>> GetAllCategoryByIdWithProductId(int productId)
        {
            await using var _context = new RestaurantDbContext();
            var categories = await _context.Categories
                .Include(c => c.Products.Where(p => p.Id == productId))
                    .ThenInclude(p => p.Images)
                .ToListAsync();
            return categories;
        }
    }
}
