using Microsoft.EntityFrameworkCore;
using Restaurant_App.DataAccess.Abstract;
using Restaurant_App.DataAccess.Concrete.EfCore;
using Restaurant_App.Entities.Concrete;
using Restaurant_App.Entities.Enums;
using System.Linq.Expressions;

namespace Restaurant_App.DataAccess.Concrete.EfCore
{
    public class ProductDal : GenericRepository<Product, RestaurantDbContext>, IProductDal
    {
        private readonly RestaurantDbContext _context;

        public ProductDal(RestaurantDbContext context) : base(context)
        {
            _context = context;
        }

        // 1. GENEL LİSTELEME (GetAll Override)
        public override async Task<List<Product>> GetAll(Expression<Func<Product, bool>>? filter = null)
        {
            var query = _context.Products
                .Include(p => p.Images)
                .Include(p => p.Category)
                .Include(p => p.Comments)
                .Include(p => p.Ratings)
                .AsQueryable();

            if (filter != null) query = query.Where(filter);

            return await query.ToListAsync();
        }

        // 2. FİLTRELİ LİSTELEME (Manager katmanı GetListAsync çağırırsa burası çalışır)
        // GenericRepository'deki metodu eziyoruz ki Include'lar devreye girsin.
        public override async Task<List<Product>> GetListAsync(Expression<Func<Product, bool>>? filter = null)
        {
            var query = _context.Products
               .Include(p => p.Category)
               .Include(p => p.Images)
               .Include(p => p.Comments)
               .Include(p => p.Ratings)
               .AsQueryable();

            if (filter != null) query = query.Where(filter);

            return await query.ToListAsync();
        }

        // 3. ANASAYFA (ŞEFİN İMZASI)
        public async Task<List<Product>> GetMostPopularProducts(int count)
        {
            return await _context.Products
                .Include(p => p.Images)
                .Include(p => p.Category)
                .Include(p => p.Comments)
                .Include(p => p.Ratings) 
                .OrderByDescending(p =>
                    // Mantık: (Ortalama Puan * 0.7) + (Puan Veren Sayısı * 0.3)
                    // Hem yüksek puanlı hem de çok kişinin puanladığı ürünler üste çıkar.
                    ((p.Ratings.Any() ? p.Ratings.Average(r => (double)r.Value) : 0) * 0.7) +
                    (p.Ratings.Count * 0.3)
                )
                .Take(count)
                .ToListAsync();
        }

        // 4. MENÜ SAYFASI (Kategoriye Göre & Sayfalama)
        public async Task<List<Product>> GetProductsByCategory(string category, int page, int pageSize)
        {
            var query = _context.Products
                .Include(p => p.Images)
                .Include(p => p.Category)
                .Include(p => p.Comments) 
                .AsQueryable();

            // Eğer "Tümü" değilse filtrele
            if (!string.IsNullOrEmpty(category) && category != "Tümü")
            {
                query = query.Where(p => p.Category.Name == category);
            }

            return await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        // 5. DETAY SAYFASI
        public async Task<Product> GetProductDetails(int id)
        {
            var product = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Images)
                .Include(p => p.Comments)
                .FirstOrDefaultAsync(p => p.Id == id);

            return product ?? throw new ArgumentNullException("Böyle bir ürün yok!");
        }

        // 6. ARAMA İŞLEMİ
        public async Task<List<Product>> SearchProducts(string searchTerm)
        {
            return await _context.Products
                .Where(p => p.Name.Contains(searchTerm) || p.Description.Contains(searchTerm))
                .Include(p => p.Category)
                .Include(p => p.Images)
                .Include(p => p.Comments) // <--- Aramada da puan görünsün
                .ToListAsync();
        }

        // 7. EN İYİLER (Top Rated)
        public async Task<List<Product>> GetTopRatedProducts(RatingValue minRatingValue, int count)
        {
            int minValue = (int)minRatingValue;
            return await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Images)
                .Include(p => p.Comments)
                .Where(p => p.Comments.Any() && p.Comments.Average(c => c.RatingValue) >= minValue)
                .OrderByDescending(p => p.Comments.Any() ? p.Comments.Average(c => c.RatingValue) : 0)
                .Take(count)
                .ToListAsync();
        }

        // 8. Kategori Sayısı (Helper)
        public async Task<int> GetCountByCategory(string category)
        {
            var query = _context.Products.AsQueryable();
            if (!string.IsNullOrEmpty(category) && category != "Tümü")
            {
                query = query.Where(p => p.Category.Name == category);
            }
            return await query.CountAsync();
        }

        // 9. GetAllWithDetails (Interface gereği)
        public async Task<List<Product>> GetAllWithDetails()
        {
            return await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Images)
                .Include(p => p.Comments)
                .Include(p => p.Ratings)
                .Where(p => !p.IsDeleted)
                .ToListAsync();
        }
    }
}