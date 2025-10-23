using Microsoft.EntityFrameworkCore;
using Restaurant_App.DataAccess.Abstract;
using Restaurant_App.DataAccess.Concrete.EfCore;
using Restaurant_App.Entities.Concrete;

namespace Restaurant_App.DataAccess.Concrete
{
    public class ProductDal : GenericRepository<Product, RestaurantDbContext>, IProductDal
    {
        //Category'e göre toplam ürün sayısını döner.
        public async Task<int> GetCountByCategory(string category)
        {
            await using var _context = new RestaurantDbContext();
            return await _context.Products
                .Where(P => P.Category.Name == category)
                .CountAsync();
        }

        public async Task<List<Product>> GetMostPopularProducts(int count)
        {
            await using var _context = new RestaurantDbContext();
            return await _context.Products
                .Include(p => p.Ratings)
                .Include(p => p.Comments)
                .OrderByDescending(p =>
                    (p.Ratings.Any() ? p.Ratings.Average(r => r.AverageRating) : 0) * 0.7 + // 70% ağırlık rating ortalamasına
                    (p.Comments.Count > 0 ? p.Comments.Count : 0) * 0.3)                   // 30% ağırlık yorum sayısına
                .Take(count)
                .ToListAsync();
        }

        public async Task<Product> GetProductDetails(int id)
        {
            await using var _context = new RestaurantDbContext();
            var product = await _context.Products
                .Include(p => p.Category)
                .Include(p=> p.Images)
                .Include(p => p.Ratings)
                    .ThenInclude(r=> r.Comments)
                .FirstOrDefaultAsync(p => p.Id == id);
            return product ?? throw new ArgumentNullException("Böyle bir ürün yok!");
        }
        //Kategoriye göre ürünleri sayfalama ile getir (pagination)
        public async Task<List<Product>> GetProductsByCategory(string category, int page, int pageSize)
        {
            await using var _context = new RestaurantDbContext();
            return await _context.Products
                .Where(p=>p.Category.Name == category)
                .Skip((page-1)* pageSize)
                .Take(pageSize)
                .Include(p=>p.Images)
                .ToListAsync();
        }

        public async Task<List<Product>> GetTopRatedProducts(Value minRatingValue, int count)
        {
            await using var _context = new RestaurantDbContext();

            return await _context.Products
                .Include(p => p.Ratings)
                .Where(p => p.Ratings.Any(r => r.Value >= minRatingValue))
                .OrderByDescending(p => p.Ratings.Any()
                    ? p.Ratings.Average(r => r.AverageRating)
                    : 0)
                .Take(count)
                .ToListAsync();
        }

        public async Task<List<Product>> SearchProducts(string searchTerm)
        {
            await using var _context = new RestaurantDbContext();

            return await _context.Products
                .Where(p => p.Name.Contains(searchTerm) || p.Description.Contains(searchTerm))
                .Include(p=> p.Images)
                .ToListAsync();
        }

        public async Task Update(Product entity, int[] categoryIds)
        {
           await using var _context = new RestaurantDbContext();
            _context.Products.Update(entity);
            await _context.SaveChangesAsync();

            var existingCategories = _context.ProductCategories
                .Where(pc => pc.ProductId == entity.Id);
            _context.ProductCategories.RemoveRange(existingCategories);

            foreach(var categoryId in categoryIds)
            {
                _context.ProductCategories.Add(new ProductCategory
                {
                    ProductId = entity.Id,
                    CategoryId = categoryId
                });
            }
            await _context.SaveChangesAsync();
        }
    }
}
