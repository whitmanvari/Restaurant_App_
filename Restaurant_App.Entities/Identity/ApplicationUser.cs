using Microsoft.AspNetCore.Identity;

namespace Restaurant_App.Entities.Identity
{
    public class ApplicationUser: IdentityUser
    {
        public string FullName { get; set; } = string.Empty;
    }
}
