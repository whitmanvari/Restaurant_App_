using Microsoft.AspNetCore.Identity;

namespace Restaurant_App.Entities.Identity
{
    public class ApplicationUser: IdentityUser
    {
        public string FullName { get; set; } = string.Empty;
        public string? Address { get; set; }
        public string? City { get; set; }
    }
}
