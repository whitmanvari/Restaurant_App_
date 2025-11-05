using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Restaurant_App.Business.Abstract;
using Restaurant_App.Entities.Concrete;
using Restaurant_App.Application.Dto; 
using Restaurant_App.Entities.Enum; 
using System.Security.Claims;

namespace Restaurant_App.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CommentController : ControllerBase
    {
        private readonly ICommentService _commentService;
        private readonly IMapper _mapper;
        public CommentController(ICommentService commentService, IMapper mapper)
        {
            _commentService = commentService;
            _mapper = mapper;
        }

        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] CommentDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                return Unauthorized("Kullanıcı bulunamadı.");

            var comment = new Comment
            {
                Text = dto.Text,
                UserId = userId,
                // RatingId = 0 (Yeni oluşacak)
                Rating = new Rating
                {
                    Value = (RatingValue)dto.RatingValue,
                    UserId = userId,
                    ProductId = dto.ProductId
                }
            };

            await _commentService.Create(comment);

            var responseDto = _mapper.Map<CommentDTO>(comment);
            return Ok(responseDto);
        }

        [HttpGet("ByProduct/{productId}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetByProduct(int productId)
        {
            var comments = await _commentService.GetCommentsWithRatingsByProductId(productId);
            var dto = _mapper.Map<List<CommentDTO>>(comments); 
            return Ok(dto);
        }

        [HttpGet("ByUser")]
        public async Task<IActionResult> GetByUser()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var comments = await _commentService.GetCommentsByUserId(userId);
            return Ok(_mapper.Map<List<CommentDTO>>(comments));
        }

        [HttpDelete("Delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var comment = await _commentService.GetById(id);
            if (comment == null)
                return NotFound("Yorum bulunamadı.");

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (comment.UserId != userId && !User.IsInRole("Admin")) // Adminler silebilir
                return Unauthorized("Bu yorumu silme yetkiniz yok.");

            await _commentService.Delete(comment);
            return NoContent();
        }
    }
}