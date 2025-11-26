using Restaurant_App.Application.Dto;
using Restaurant_App.Application.Pagination;
using Restaurant_App.Business.Abstract;
using Restaurant_App.DataAccess.Abstract;
using Restaurant_App.Entities.Concrete;
using Restaurant_App.Entities.Enums;
using System.Linq.Expressions;

namespace Restaurant_App.Business.Concrete
{
    public class ProductManager : IProductService, IService<Product>
    {
        private readonly IProductDal _productDal;
        public ProductManager(IProductDal productDal)
        {
            _productDal = productDal;
        }

        public async Task Create(Product entity)
        {
            await _productDal.Create(entity);
        }

        public async Task Delete(Product entity)
        {
            await _productDal.Delete(entity);
        }

        public async Task<List<Product>> GetAll(Expression<Func<Product, bool>>? filter = null)
        {
            return await _productDal.GetAll(filter);
        }

        public async Task<Product> GetById(int id)
        {
            return await _productDal.GetById(id);
        }

        public async Task<int> GetCountByCategory(string category)
        {
            return await _productDal.GetCountByCategory(category);
        }

        public async Task<List<Product>> GetMostPopularProducts(int count)
        {
            return await _productDal.GetMostPopularProducts(count);
        }

        public async Task<Product> GetOne(Expression<Func<Product, bool>>? filter = null)
        {
            return await _productDal.GetOne(filter);
        }

        public async Task<Product> GetProductDetails(int id)
        {
            return await _productDal.GetProductDetails(id);
        }

        public async Task<List<Product>> GetTopRatedProducts(RatingValue minRatingValue, int count)
        {
            return await _productDal.GetTopRatedProducts(minRatingValue, count);
        }

        public async Task<List<Product>> SearchProducts(string searchTerm)
        {
            return await _productDal.SearchProducts(searchTerm);
        }

        public async Task Update(Product entity)
        {
            await _productDal.Update(entity);
        }

        // FİLTRELEME VE SAYFALAMA METODU 
        public async Task<PagedResponse<ProductDTO>> GetProductsByFilter(PaginationParams p)
        {
            // 1. Tüm aktif ürünleri çek 
            var allProducts = await _productDal.GetAll(x => !x.IsDeleted);

            // 2. Alerjen Filtreleme
            if (p.ExcludeAllergens.HasValue && p.ExcludeAllergens.Value > 0)
            {
                allProducts = allProducts.Where(x => ((int)x.Allergic & p.ExcludeAllergens.Value) == 0).ToList();
            }

            // 3. Kategori Filtresi
            if (!string.IsNullOrEmpty(p.Category) && p.Category != "Tümü")
            {
                allProducts = allProducts.Where(x =>
                    x.Category != null &&
                    x.Category.Name.Trim().ToLower() == p.Category.Trim().ToLower()
                ).ToList();
            }

            // 4. Arama Filtresi
            if (!string.IsNullOrEmpty(p.SearchTerm))
            {
                string lowerTerm = p.SearchTerm.ToLower();
                allProducts = allProducts.Where(x =>
                    x.Name.ToLower().Contains(lowerTerm) ||
                    x.Description.ToLower().Contains(lowerTerm)
                ).ToList();
            }

            // 5. Sayfalama (Pagination)
            int totalRecords = allProducts.Count;

            var pagedList = allProducts
                .Skip((p.PageNumber - 1) * p.PageSize)
                .Take(p.PageSize)
                .ToList();

            // 6. DTO Dönüşümü 
            var dtoList = pagedList.Select(p => new ProductDTO
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                Price = p.Price,
                CategoryId = p.CategoryId,
                CategoryName = p.Category?.Name ?? "",
                ImageUrls = p.Images.Select(i => i.Url).ToList(),
                Allergic = (int)p.Allergic,
                Ingredients = p.Ingredients
            }).ToList();
            

            return new PagedResponse<ProductDTO>(dtoList, p.PageNumber, p.PageSize, totalRecords);
        }
    }
}