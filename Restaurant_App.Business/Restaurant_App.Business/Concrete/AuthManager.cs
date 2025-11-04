using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Restaurant_App.Business.Abstract;
using Restaurant_App.Application.Dto; 
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Restaurant_App.Entities.Identity; 

namespace Restaurant_App.Business.Concrete
{
    public class AuthManager : IAuthService
    {
        private readonly UserManager<ApplicationUser>? _userManager;
        private readonly SignInManager<ApplicationUser>? _signInManager;
        private readonly IConfiguration _configuration;

        public AuthManager(UserManager<ApplicationUser>? userManager, SignInManager<ApplicationUser>? signInManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
        }

        public async Task<string?> Login(UserLoginDTO model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null) return null;

            var result = await _signInManager.CheckPasswordSignInAsync(user, model.Password, false);
            if (!result.Succeeded) return null;

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(3),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public async Task<bool> Register(UserRegisterDTO model)
        {
            var user = new ApplicationUser
            {
                FullName = model.FullName,
                UserName = model.Email,
                Email = model.Email
            };
            var result = await _userManager.CreateAsync(user, model.Password);
            return result.Succeeded;
        }
    }
}