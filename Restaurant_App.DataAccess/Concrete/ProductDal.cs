using Microsoft.EntityFrameworkCore;
using Restaurant_App.DataAccess.Abstract;
using Restaurant_App.DataAccess.Concrete.EfCore;
using Restaurant_App.Entities.Concrete;
using Restaurant_App.Entities.Enums;
using System.Linq;
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

        // 1. GETALL METODU (Tüm Listeleme İşlemleri İçin)
        public override async Task<List<Product>> GetAll(Expression<Func<Product, bool>>? filter = null)
        {
            var query = _context.Products
                .Include(p => p.Category)
                .Include(p => p.Images)
                .Include(p => p.Comments) // Puan hesabı için
                .AsQueryable();

            if (filter != null)
            {
                query = query.Where(filter);
            }

            return await query.ToListAsync();
        }

        // 2. KATEGORİ SAYISI
        public async Task<int> GetCountByCategory(string category)
        {
            return await _context.Products
                .Include(p => p.Category)
                .Where(p => p.Category.Name == category)
                .CountAsync();
        }

        // 3. EN POPÜLER ÜRÜNLER (Anasayfa İçin)
        public async Task<List<Product>> GetMostPopularProducts(int count)
        {
            return await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Images)
                .Include(p => p.Comments)
                .OrderByDescending(p =>
                    // Puan ortalaması (%70) + Yorum sayısı (%30) ağırlıklı sıralama
                    ((p.Comments.Any() ? p.Comments.Average(c => (double)c.RatingValue) : 0) * 0.7) +
                    (p.Comments.Count * 0.3)
                )
                .Take(count)
                .ToListAsync();
        }

        // 4. DETAYLI ÜRÜN BİLGİSİ
        public async Task<Product> GetProductDetails(int id)
        {
            var product = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Images)
                .Include(p => p.Comments) // Yorumlar ve puanlar buradan gelecek
                .FirstOrDefaultAsync(p => p.Id == id);

            return product ?? throw new ArgumentNullException("Böyle bir ürün yok!");
        }

        // 5. KATEGORİYE GÖRE ÜRÜNLER (Sayfalamalı)
        public async Task<List<Product>> GetProductsByCategory(string category, int page, int pageSize)
        {
            return await _context.Products
                .Include(p => p.Category)
                .Where(p => p.Category.Name == category)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Include(p => p.Images)
                .Include(p => p.Comments)
                .ToListAsync();
        }

        // 6. EN YÜKSEK PUANLI ÜRÜNLER
        public async Task<List<Product>> GetTopRatedProducts(RatingValue minRatingValue, int count)
        {
            int minValue = (int)minRatingValue;

            return await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Images)
                .Include(p => p.Comments)
                // En az bir yorumu olan ve ortalaması eşik değerden yüksek olanlar
                .Where(p => p.Comments.Any() && p.Comments.Average(c => c.RatingValue) >= minValue)
                .OrderByDescending(p => p.Comments.Any() ? p.Comments.Average(c => c.RatingValue) : 0)
                .Take(count)
                .ToListAsync();
        }

        // 7. ARAMA
        public async Task<List<Product>> SearchProducts(string searchTerm)
        {
            return await _context.Products
                .Where(p => p.Name.Contains(searchTerm) || p.Description.Contains(searchTerm))
                .Include(p => p.Category)
                .Include(p => p.Images)
                .Include(p => p.Comments)
                .ToListAsync();
        }

        public override async Task<List<Product>> GetListAsync(Expression<Func<Product, bool>>? filter = null)
        {
            var query = _context.Products
               .Include(p => p.Category)
               .Include(p => p.Images)
               .Include(p => p.Comments) 
               .AsQueryable();

            if (filter != null) query = query.Where(filter);

            return await query.ToListAsync();
        }
    }
}