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

        [HttpGet("getall")]
        public async Task<IActionResult> GetAll()
        {
            var categories = await _categoryService.GetAll();
            var dto = _mapper.Map<List<CategoryDTO>>(categories);
            return Ok(dto);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var category = await _categoryService.GetCategoryByIdWithProducts(id);
            if (category == null) return NotFound();
            var dto = _mapper.Map<CategoryDTO>(category);
            return Ok(dto);
        }

        [HttpPost("create")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] CategoryDTO dto)
        {
            if (dto == null) return BadRequest("Kategori bilgisi eksik.");
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var category = _mapper.Map<Category>(dto);
            await _categoryService.Create(category);

            var responseDto = _mapper.Map<CategoryDTO>(category);
            return CreatedAtAction(nameof(GetById), new { id = responseDto.Id }, responseDto);
        }

        [HttpPut("update/{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] CategoryDTO dto)
        {
            if (dto == null) return BadRequest("Kategori bilgisi eksik.");
            if (id != dto.Id) return BadRequest("ID uyuşmazlığı.");
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var existing = await _categoryService.GetById(id);
            if (existing == null) return NotFound();

            _mapper.Map(dto, existing); // DTO'dan -> mevcut Entity'ye map'le
            await _categoryService.Update(existing);

            return Ok(_mapper.Map<CategoryDTO>(existing));
        }

        [HttpDelete("delete/{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var category = await _categoryService.GetById(id);
            if (category == null) return NotFound("Kategori bulunamadı.");

            await _categoryService.Delete(category);
            return NoContent(); // 204 No Content
        }
    }
}