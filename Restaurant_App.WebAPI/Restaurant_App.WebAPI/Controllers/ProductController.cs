using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Restaurant_App.Application.Dto;
using Restaurant_App.Application.Pagination;
using Restaurant_App.Business.Abstract;
using Restaurant_App.Entities.Concrete;
using Restaurant_App.Entities.Enums;

namespace Restaurant_App.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _productService;
        private readonly IMapper _mapper;

        public ProductController(IProductService productService, IMapper mapper)
        {
            _productService = productService;
            _mapper = mapper;
        }

        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll()
        {
            var products = await _productService.GetAll();
            var dto = _mapper.Map<List<ProductDTO>>(products);
            return Ok(dto);
        }

        [HttpGet("GetById/{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var product = await _productService.GetProductDetails(id);
            if (product == null) return NotFound();

            var dto = _mapper.Map<ProductDTO>(product);
            return Ok(dto);
        }

        [HttpPost("Create")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] ProductDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var product = _mapper.Map<Product>(dto);
            await _productService.Create(product);

            var responseDto = _mapper.Map<ProductDTO>(product);
            return CreatedAtAction(nameof(Get), new { id = responseDto.Id }, responseDto);
        }

        [HttpPut("Update/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] ProductDTO dto)
        {
            if (id != dto.Id) return BadRequest("ID uyuşmazlığı.");
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var existingProduct = await _productService.GetById(id);
            if (existingProduct == null)
                return NotFound("Ürün bulunamadı!");

            _mapper.Map(dto, existingProduct); // DTO -> mevcut Entity
            await _productService.Update(existingProduct);

            return Ok(_mapper.Map<ProductDTO>(existingProduct));
        }

        [HttpDelete("Delete/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var product = await _productService.GetById(id);
            if (product == null)
                return NotFound("Ürün bulunamadı!");

            await _productService.Delete(product);
            return NoContent();
        }

        [HttpGet("Search")]
        public async Task<IActionResult> Search(string term)
        {
            var result = await _productService.SearchProducts(term);
            return Ok(_mapper.Map<List<ProductDTO>>(result));
        }

        [HttpGet("MostPopular")]
        public async Task<IActionResult> GetMostPopular(int count)
        {
            var result = await _productService.GetMostPopularProducts(count);
            return Ok(_mapper.Map<List<ProductDTO>>(result));
        }

        [HttpGet("TopRated")]
        public async Task<IActionResult> GetTopRated(RatingValue minRating, int count)
        {
            var result = await _productService.GetTopRatedProducts(minRating, count);
            return Ok(_mapper.Map<List<ProductDTO>>(result));
        }

        [HttpGet("CountByCategory")]
        public async Task<IActionResult> CountByCategory(string category)
        {
            var count = await _productService.GetCountByCategory(category);
            return Ok(count);
        }

        [HttpGet("filter")]
        public async Task<IActionResult> GetByFilter([FromQuery] PaginationParams p)
        {
            var response = await _productService.GetProductsByFilter(p);
            return Ok(response);
        }
    }
}