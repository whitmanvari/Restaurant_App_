using Microsoft.AspNetCore.Identity;

namespace Restaurant_App.Business.Identity
{
    public class ApplicationUser: IdentityUser
    {
        public string FullName { get; set; }
    }
}
