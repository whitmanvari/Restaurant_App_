using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Restaurant_App.Business.Abstract;
using Restaurant_App.Entities.Concrete;
using Restaurant_App.Entities.Enum;
using Restaurant_App.WebAPI.ViewModels.Concrete;

namespace Restaurant_App.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _productService;
        public ProductController(IProductService productService)
        {
            _productService = productService;
        }

        //get api/product/getall
        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll()
        {
            var products = await _productService.GetAll();
            return Ok(products);
        }

        //get api/product/getbyid/{id}
        //id ile ürünü getir
        [HttpGet("GetById/{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var product = await _productService.GetProductDetails(id);
            return Ok(product);
        }

        //post api/product/create
        //yeni ürün ekle
        [HttpPost("Create")]
        public async Task<IActionResult> Create(ProductViewModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(model);

            var product = new Product
            {
                Name = model.Data.Name,
                Description = model.Data.Description,
                Price = model.Data.Price,
                CategoryId = model.Data.CategoryId
            };

            await _productService.Create(product);

            model.IsSuccess = true;
            model.Message = "Ürün başarıyla oluşturuldu!";
            return Ok(model);
        }

        //put api/product/update
        [HttpPut("Update/{id}")]
        public async Task<IActionResult> Update(int id, ProductViewModel model, [FromQuery] int[] categoryIds)
        {
            if (!ModelState.IsValid)
                return BadRequest(model);

            var existingProduct = await _productService.GetById(id);
            if (existingProduct == null)
                return NotFound("Ürün bulunamadı!");

            existingProduct.Name = model.Data.Name;
            existingProduct.Description = model.Data.Description;
            existingProduct.Price = model.Data.Price;
            existingProduct.CategoryId = model.Data.CategoryId;

            await _productService.UpdateProduct(existingProduct, categoryIds);

            model.IsSuccess = true;
            model.Message = "Ürün başarıyla güncellendi!";
            return Ok(model);
        }

        //delete api/product/delete/{id}
        [HttpDelete("Delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var product = await _productService.GetById(id);
            if (product == null)
                return NotFound("Ürün bulunamadı!");

            await _productService.Delete(product);
            return Ok("Ürün başarıyla silindi!");
        }

        //get api/product/search
        [HttpGet("Search")]
        public async Task<IActionResult> Search(string term)
        {
            var result = await _productService.SearchProducts(term);
            return Ok(result);
        }

        //get most popular products
        [HttpGet("MostPopular")]
        public async Task<IActionResult> GetMostPopular(int count)
        {
            var result = await _productService.GetMostPopularProducts(count);
            return Ok(result);
        }

        //get top rated products
        [HttpGet("TopRated")]
        public async Task<IActionResult> GetTopRated(RatingValue minRating, int count)
        {
            var result = await _productService.GetTopRatedProducts(minRating, count);
            return Ok(result);
        }

        //get count by category
        [HttpGet("CountByCategory")]
        public async Task<IActionResult> CountByCategory(string category)
        {
            var count = await _productService.GetCountByCategory(category);
            return Ok(count);
        }
    }
}
