using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Restaurant_App.Application.Dto;
using Restaurant_App.Business.Abstract;
using Restaurant_App.Entities.Concrete;

namespace Restaurant_App.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _categoryService;
        private readonly IMapper _mapper;

        public CategoryController(ICategoryService categoryService, IMapper mapper)
        {
            _categoryService = categoryService;
            _mapper = mapper;
        }

        // GET: api/category/getall
        [HttpGet("getall")]
        public async Task<IActionResult> GetAll()
        {
            var categories = await _categoryService.GetAll();
            var dto = _mapper.Map<List<CategoryDTO>>(categories);
            return Ok(dto);
        }

        // GET: api/category/5
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var category = await _categoryService.GetCategoryByIdWithProducts(id);
                if (category == null) return NotFound();
                var dto = _mapper.Map<CategoryDTO>(category);
                return Ok(dto);
            }
            catch
            {
                return NotFound();
            }
        }

        // POST: api/category/create
        [HttpPost("create")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] CategoryDTO dto)
        {
            if (dto == null) return BadRequest("Kategori bilgisi eksik.");
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var category = _mapper.Map<Category>(dto);
            await _categoryService.Create(category);

            return Ok(new { Success = true, Message = "Kategori oluşturuldu." });
        }

        // PUT: api/category/update/5
        [HttpPut("update/{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] CategoryDTO dto)
        {
            if (dto == null) return BadRequest("Kategori bilgisi eksik.");
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var existing = await _categoryService.GetById(id);
            if (existing == null) return NotFound();

            // Map DTO -> existing entity (preserve Id)
            _mapper.Map(dto, existing);
            await _categoryService.Update(existing);

            return Ok(new { Success = true, Message = "Kategori güncellendi." });
        }

        // DELETE: api/category/delete/5
        [HttpDelete("delete/{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var category = await _categoryService.GetById(id);
            if (category == null) return NotFound("Kategori bulunamadı.");

            await _categoryService.Delete(category);
            return Ok(new { Success = true, Message = "Kategori silindi." });
        }

        // DELETE: api/category/{categoryId}/product/{productId}
        [HttpDelete("{categoryId:int}/product/{productId:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteProductFromCategory(int categoryId, int productId)
        {
            try
            {
                await _categoryService.DeleteFromCategory(categoryId, productId);
                return Ok(new { Success = true, Message = "Ürün kategoriden kaldırıldı." });
            }
            catch (ArgumentNullException ex)
            {
                return NotFound(ex.Message);
            }
            catch
            {
                return BadRequest("İşlem sırasında hata oluştu.");
            }
        }
    }
}