using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Restaurant_App.Application.Dto;
using Restaurant_App.Business.Abstract;
using System.Security.Claims;

namespace Restaurant_App.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RatingController : ControllerBase
    {
        private readonly IRatingService _ratingService;
        private readonly IMapper _mapper;

        public RatingController(IRatingService ratingService, IMapper mapper)
        {
            _ratingService = ratingService;
            _mapper = mapper;
        }

        // Bir ürünün ortalama puanını getir
        [HttpGet("product/{productId}/average")]
        [AllowAnonymous] // Herkes görebilir
        public async Task<IActionResult> GetAverageRating(int productId)
        {
            var average = await _ratingService.GetAverageRatingForProduct(productId); 
            return Ok(new { ProductId = productId, AverageRating = average });
        }

        // Bir ürüne ait tüm puanlamaları (yorumsuz) getir
        [HttpGet("product/{productId}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetRatingsForProduct(int productId)
        {
            var ratings = await _ratingService.GetRatingsWithProducts(productId); 
            var dto = _mapper.Map<List<RatingDTO>>(ratings); 
            return Ok(dto);
        }

        // Kullanıcının kendi verdiği tüm puanlamaları getir
        [HttpGet("MyRatings")]
        [Authorize] // Yetki gerektirir
        public async Task<IActionResult> GetMyRatings()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                return Unauthorized("Kullanıcı bilgisi bulunamadı.");

            var ratings = await _ratingService.GetRatingsByUserId(userId); //
            var dto = _mapper.Map<List<RatingDTO>>(ratings); //
            return Ok(dto);
        }

        // Rating silme işlemi de Comment silme ile ilişkili olduğundan
        // ve veritabanı bütünlüğünü (foreign key constraint)
        // bozmamak için buraya eklemiyoruz.
    }
}
