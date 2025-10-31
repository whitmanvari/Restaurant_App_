using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Restaurant_App.Business.Abstract;
using Restaurant_App.Entities.Dto;

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
    }
}
