using Microsoft.EntityFrameworkCore;
using Restaurant_App.DataAccess.Abstract;
using Restaurant_App.DataAccess.Concrete.EfCore;
using Restaurant_App.Entities.Concrete;
using Restaurant_App.Entities.Enum;

namespace Restaurant_App.DataAccess.Concrete
{
    public class ProductDal : GenericRepository<Product, RestaurantDbContext>, IProductDal
    {
        public ProductDal(RestaurantDbContext context) : base(context)
        {
        }

        public async Task<int> GetCountByCategory(string category)
        {
            return await _context.Products
                .Where(P => P.Category.Name == category)
                .CountAsync();
        }

        public async Task<List<Product>> GetMostPopularProducts(int count)
        {
            return await _context.Products
                .Include(p => p.Ratings)
                .Include(p => p.Comments)
                .OrderByDescending(p =>
                    (p.Ratings.Any() ? p.Ratings.Average(r => (int)r.Value) : 0) * 0.7 +
                    (p.Comments.Count > 0 ? p.Comments.Count : 0) * 0.3)
                .Take(count)
                .ToListAsync();
        }

        public async Task<Product> GetProductDetails(int id)
        {
            var product = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Images)
                .Include(p => p.Ratings)
                    .ThenInclude(r => r.Comments)
                .FirstOrDefaultAsync(p => p.Id == id);
            return product ?? throw new ArgumentNullException("Böyle bir ürün yok!");
        }

        public async Task<List<Product>> GetProductsByCategory(string category, int page, int pageSize)
        {
            return await _context.Products
                .Where(p => p.Category.Name == category)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Include(p => p.Images)
                .ToListAsync();
        }

        public async Task<List<Product>> GetTopRatedProducts(RatingValue minRatingValue, int count)
        {
            return await _context.Products
                .Include(p => p.Ratings)
                .Where(p => p.Ratings.Any(r => r.Value >= minRatingValue))
                .OrderByDescending(p => p.Ratings.Any()
                    ? p.Ratings.Average(r => (int)r.Value)
                    : 0)
                .Take(count)
                .ToListAsync();
        }

        public async Task<List<Product>> SearchProducts(string searchTerm)
        {
            return await _context.Products
                .Where(p => p.Name.Contains(searchTerm) || p.Description.Contains(searchTerm))
                .Include(p => p.Images)
                .ToListAsync();
        }
    }
}