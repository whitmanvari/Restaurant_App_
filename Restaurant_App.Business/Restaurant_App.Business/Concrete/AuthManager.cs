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

            // 1. Kullanıcının rollerini veritabanından çek
            var userRoles = await _userManager.GetRolesAsync(user);

            // 2. Temel claim'leri oluştur
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            // 3. Çektiğimiz rolleri claim listesine 'ClaimTypes.Role' olarak ekle
            foreach (var role in userRoles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var jwtKey = _configuration["DataAccess:Jwt:Key"];
            var jwtIssuer = _configuration["DataAccess:Jwt:Issuer"];
            var jwtAudience = _configuration["DataAccess:Jwt:Audience"];

            if (string.IsNullOrEmpty(jwtKey) || string.IsNullOrEmpty(jwtIssuer) || string.IsNullOrEmpty(jwtAudience))
            {
                throw new ArgumentNullException("JWT ayarları appsettings.json dosyasında eksik veya hatalı.");
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: jwtIssuer,
                audience: jwtAudience,
                claims: claims,
                expires: DateTime.Now.AddHours(3),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
        public async Task<IdentityResult> Register(UserRegisterDTO model)
        {
            var user = new ApplicationUser
            {
                FullName = model.FullName,
                UserName = model.Email,
                Email = model.Email,
                PhoneNumber = model.PhoneNumber,
                Address = model.Address,
                City = model.City
            };
            var result = await _userManager.CreateAsync(user, model.Password);
            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(user, "User"); //yeni kullanıcıya varsayılan olarak user ata
            }
            return result;
        }
    }
}