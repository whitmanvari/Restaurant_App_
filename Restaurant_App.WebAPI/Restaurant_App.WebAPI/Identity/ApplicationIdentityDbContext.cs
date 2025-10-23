using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace Restaurant_App.WebAPI.Identity
{
    public class ApplicationIdentityDbContext: IdentityDbContext<ApplicationUser>
    {
    }
}
