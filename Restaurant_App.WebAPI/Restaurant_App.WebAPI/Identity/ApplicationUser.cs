using Microsoft.AspNetCore.Identity;

namespace Restaurant_App.WebAPI.Identity
{
    public class ApplicationUser: IdentityUser
    {
        public string FullName { get; set; }
    }
}
