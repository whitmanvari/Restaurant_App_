using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Restaurant_App.Application.Dto; 
using Restaurant_App.Business.Abstract;
using System.Security.Claims;

namespace Restaurant_App.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegisterDTO model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _authService.Register(model);
            if (!result.Succeeded)
            {
                var errors = result.Errors.Select(e => e.Description).ToList();
                return BadRequest(new { Errors = errors });
            }

            return Ok("Kullanıcı başarıyla oluşturuldu.");
        }
        [HttpPut("update-profile")]
        [Authorize]
        public async Task<IActionResult> UpdateProfile([FromBody] UserUpdateDTO model)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var result = await _authService.UpdateUserProfile(userId, model);
            if (result) return Ok(new { Message = "Profil güncellendi." });
            return BadRequest("Güncelleme sırasında hata oluştu.");
        }

        [HttpGet("get-profile")]
        [Authorize]
        public async Task<IActionResult> GetProfile()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var profile = await _authService.GetUserProfile(userId);
            return Ok(profile);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginDTO model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var token = await _authService.Login(model);
            if (token == null)
                return Unauthorized("Email veya şifre hatalı.");

            return Ok(new { Token = token });
        }
    }
}