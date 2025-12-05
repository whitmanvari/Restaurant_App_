using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Restaurant_App.Application.Dto; 
using Restaurant_App.Business.Abstract;
using Restaurant_App.Entities.Identity;
using System.Security.Claims;

namespace Restaurant_App.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IEmailService _emailService;
        public AuthController(IAuthService authService, UserManager<ApplicationUser> userManager, IEmailService emailService)
        {
            _authService = authService;
            _userManager = userManager;
            _emailService = emailService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegisterDTO model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            // Kullanıcıyı oluştur (EmailConfirmed = False olarak)
            var user = new ApplicationUser
            {
                FullName = model.FullName,
                UserName = model.Email,
                Email = model.Email,
                PhoneNumber = model.PhoneNumber,
                Address = model.Address,
                City = model.City,
                EmailConfirmed = false // Onaylı değil!
            };

            var result = await _userManager.CreateAsync(user, model.Password);

            if (!result.Succeeded)
            {
                var errors = result.Errors.Select(e => e.Description).ToList();
                return BadRequest(new { Errors = errors });
            }

            // Rol Ata
            await _userManager.AddToRoleAsync(user, "User");

            // --- EMAIL ONAY TOKENI OLUŞTUR ---
            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);

            // Frontend Linki: http://localhost:5173/confirm-email?uid=...&t=...
            var confirmationLink = $"http://localhost:5173/confirm-email?uid={user.Id}&t={System.Net.WebUtility.UrlEncode(token)}";

            var body = $"<h3>Hoşgeldiniz {user.FullName}!</h3>" +
                       $"<p>Lütfen hesabınızı doğrulamak için <a href='{confirmationLink}'>buraya tıklayınız</a>.</p>";

            try
            {
                await _emailService.SendMailAsync(user.Email, "LUNA - Email Doğrulama", body);
            }
            catch
            {
                // Mail atılamazsa bile kullanıcı oluştu, manuel onay gerekebilir.
                return Ok("Kayıt başarılı ancak doğrulama maili gönderilemedi. Destek ile iletişime geçin.");
            }

            return Ok("Kayıt başarılı! Lütfen e-posta adresinize gelen link ile hesabınızı doğrulayın.");
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
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null) return Unauthorized("Email veya şifre hatalı.");

            // --- KONTROL: EMAIL ONAYLI MI? ---
            if (!await _userManager.IsEmailConfirmedAsync(user))
            {
                return BadRequest("Lütfen önce e-posta adresinizi doğrulayın.");
            }

            var token = await _authService.Login(model);
            if (token == null) return Unauthorized("Email veya şifre hatalı.");

            return Ok(new { Token = token });
        }
        // ŞİFREMİ UNUTTUM (Link Gönderir)
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null) return Ok("İşlem tamamlandı."); // Güvenlik için kullanıcı yok demiyoruz

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var resetLink = $"http://localhost:5173/reset-password?email={user.Email}&token={System.Net.WebUtility.UrlEncode(token)}";
            var body = $"<h3>Şifre Sıfırlama</h3><p><a href='{resetLink}'>Yeni şifre oluşturmak için tıklayın.</a></p>";

            try
            {
                await _emailService.SendMailAsync(user.Email, "LUNA - Şifre Sıfırlama", body);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Mail gönderilemedi: " + ex.Message);
            }

            return Ok("Sıfırlama bağlantısı gönderildi.");
        }

        // ŞİFREYİ SIFIRLA (Yeni Şifreyi Kaydeder)
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDTO model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null) return BadRequest("Hata.");

            var result = await _userManager.ResetPasswordAsync(user, model.Token, model.NewPassword);
            if (result.Succeeded) return Ok("Şifre başarıyla güncellendi.");

            return BadRequest(result.Errors.Select(e => e.Description));
        }

        [HttpPost("confirm-email")]
        public async Task<IActionResult> ConfirmEmail([FromBody] ConfirmEmailDTO model)
        {
            var user = await _userManager.FindByIdAsync(model.UserId);
            if (user == null) return BadRequest("Kullanıcı bulunamadı.");

            var result = await _userManager.ConfirmEmailAsync(user, model.Token);

            if (result.Succeeded) return Ok("Hesabınız başarıyla doğrulandı! Giriş yapabilirsiniz.");

            return BadRequest("Doğrulama başarısız. Link geçersiz veya süresi dolmuş.");
        }
    }
}