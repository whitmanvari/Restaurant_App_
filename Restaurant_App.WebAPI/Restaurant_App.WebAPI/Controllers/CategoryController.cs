using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Restaurant_App.Business.Abstract;
using Restaurant_App.Entities.Concrete;
using Restaurant_App.Entities.Dto;
using Restaurant_App.WebAPI.ViewModels.Concrete;

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

        //get api/category/getall
        [HttpGet("getall")]
        public async Task<IActionResult> GetAll()
        {
            var categories = await _categoryService.GetAll();
            var dto = _mapper.Map<List<CategoryDTO>>(categories);
            return Ok(dto);
        }

        //get api/category/getbyid/{id}
        //Kategoriye ait ürünleri de dahil et
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var category = await _categoryService.GetCategoryByIdWithProducts(id);
            var dto = _mapper.Map<CategoryDTO>(category);
            return Ok(dto);
        }

        //post api/category/create
        //Yalnızca admin yetkisi olan kullanıcılar kategori oluşturabilir
        [HttpPost("create")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] CategoryViewModel model)
        {
            if (model.Data == null) 
                return BadRequest("Kategori bilgisi eksik.");

            var category = _mapper.Map<Category>(model.Data);
            await _categoryService.Create(category);

            return Ok(new
            {
                Success = true,
                Message = "Kategori başarılı şekilde oluşturuldu"
            });
        }

        //put api/category/update
        [HttpPut("update")]
        [Authorize]
        public async Task<IActionResult> Update(int id, [FromBody] CategoryViewModel model)
        {
            if (model.Data == null) 
                return BadRequest("Kategori bilgisi eksik.");

            var existing = await _categoryService.GetById(id);
            if (existing == null) 
                return NotFound();

            _mapper.Map(model.Data, existing);
            await _categoryService.Update(existing);

            return Ok(new 
            { 
                Success = true, 
                Message = "Kategori güncellendi." 
            });
        }

        //delete api/category/delete/{id}
        [HttpDelete("delete/{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var category = await _categoryService.GetById(id);
            if (category == null) 
                return NotFound("Kategori bulunamadı!");

            await _categoryService.Delete(category);

            return Ok(new 
            { 
                Success = true, 
                Message = "Kategori silindi." 
            });
        }

        //delete api/category/products/{categoryId}
        //Kategroideki ürünleri sil
        [HttpDelete("{categoryId}/product/{productId}")]
        [Authorize]
        public async Task<IActionResult> DeleteProductFromCategory(int categoryId, int productId)
        {
            await _categoryService.DeleteFromCategory(categoryId, productId);
            return Ok(new 
            {
                Success = true, 
                Message = "Ürün kategoriden kaldırıldı." 
            });
        }
    }
}
