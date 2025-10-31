using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Restaurant_App.Business.Abstract;
using Restaurant_App.Entities.Concrete;
using Restaurant_App.Entities.Dto;
using Restaurant_App.WebAPI.ViewModels.Concrete;
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

        // post create comment
        [HttpPost("create")]
        public async Task<IActionResult> Create(CommentViewModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(model);

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                return Unauthorized("Kullanıcı bulunamadı.");

            var comment = new Comment
            {
                Text = model.Data!.Text,
                ProductId = model.Data.ProductId,
                UserId = userId,
                Rating = new Rating
                {
                    Value = (Value)model.Data.RatingValue,  //cast enum (dto'da int)
                    UserId = userId,
                    ProductId = model.Data.ProductId
                }
            };

            await _commentService.Create(comment);

            model.IsSuccess = true;
            model.Message = "Yorum eklendi.";
            return Ok(model);
        }

        //product id ye göre yorumları getir
        [HttpGet("ByProduct/{productId}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetByProduct(int productId)
        {
            var comments = await _commentService.GetCommentsWithRatingsByProductId(productId);
            var dto = comments.Select(c => new CommentDTO
            {
                Id = c.Id,
                Text = c.Text,
                ProductId = c.ProductId,
                UserId = c.UserId,
                RatingValue = (int)c.Rating!.Value //Rating Value'yu int'e çevir (dto int)
            }).ToList();

            return Ok(dto);
        }

        //kullanıcıya göre yorumları getir
        [HttpGet("ByUser")]
        public async Task<IActionResult> GetByUser()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var comments = await _commentService.GetCommentsByUserId(userId);

            return Ok(comments);
        }

        //Yorumu sil (id ye göre)
        [HttpDelete("Delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var comment = await _commentService.GetById(id);
            if (comment == null)
                return NotFound("Yorum bulunamadı.");

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (comment.UserId != userId)
                return Unauthorized("Bu yorumu silme yetkiniz yok.");

            await _commentService.Delete(comment);
            return Ok("Yorum silindi.");
        }
    }
}
