using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Restaurant_App.Application.Dto;
using Restaurant_App.Entities.Identity;

namespace Restaurant_App.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")] // Sadece Adminler erişebilir!
    public class UserController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public UserController(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        // Tüm Kullanıcıları Getir
        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userManager.Users.ToListAsync();
            var userDtos = new List<UserDetailDTO>();

            foreach (var user in users)
            {
                // Kullanıcının rollerini çek
                var roles = await _userManager.GetRolesAsync(user);

                userDtos.Add(new UserDetailDTO
                {
                    Id = user.Id,
                    FullName = user.FullName,
                    Email = user.Email,
                    PhoneNumber = user.PhoneNumber,
                    City = user.City,
                    Address = user.Address,
                    Role = roles.FirstOrDefault() ?? "User" // İlk rolü al, yoksa User de
                });
            }

            return Ok(userDtos);
        }

        // Kullanıcıyı Güncelle (Admin Tarafından)
        [HttpPut("Update/{id}")]
        public async Task<IActionResult> UpdateUser(string id, [FromBody] UserDetailDTO model)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return NotFound("Kullanıcı bulunamadı.");

            user.FullName = model.FullName;
            user.PhoneNumber = model.PhoneNumber;
            user.City = model.City;
            user.Address = model.Address;

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded) return BadRequest(result.Errors);

            // Rol Güncelleme 
            var currentRoles = await _userManager.GetRolesAsync(user);
            var currentRole = currentRoles.FirstOrDefault();

            if (!string.IsNullOrEmpty(model.Role) && model.Role != currentRole)
            {
                // Eski rolü sil
                if (currentRole != null) await _userManager.RemoveFromRoleAsync(user, currentRole);
                // Yeni rolü ekle
                await _userManager.AddToRoleAsync(user, model.Role);
            }

            return Ok(new { message = "Kullanıcı güncellendi." });
        }

        // Kullanıcıyı Sil
        [HttpDelete("Delete/{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return NotFound();

            var result = await _userManager.DeleteAsync(user);
            if (!result.Succeeded) return BadRequest("Silme başarısız.");

            return Ok(new { message = "Kullanıcı silindi." });
        }
    }
}
