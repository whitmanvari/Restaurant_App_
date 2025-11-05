using Microsoft.AspNetCore.Identity;
using Restaurant_App.Entities.Identity;

namespace Restaurant_App.WebAPI.Extensions
{
    public static class IdentitySeedExtension
    {
        public static async Task SeedIdentity(this WebApplication app)
        {
            using var scope = app.Services.CreateScope();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
            var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            var config = scope.ServiceProvider.GetRequiredService<IConfiguration>();

            var adminEmail = config["AdminUser:Email"];
            var adminPassword = config["AdminUser:Password"];

            if (!await roleManager.RoleExistsAsync("Admin"))
                await roleManager.CreateAsync(new IdentityRole("Admin"));

            var admin = await userManager.FindByEmailAsync(adminEmail);
            if (admin == null)
            {
                admin = new ApplicationUser
                {
                    Email = adminEmail,
                    UserName = adminEmail,
                    FullName = "Admin",
                    EmailConfirmed = true
                };

                var result = await userManager.CreateAsync(admin, adminPassword);
                await userManager.AddToRoleAsync(admin, "Admin");
            }

            if (!await roleManager.RoleExistsAsync("User"))
                await roleManager.CreateAsync(new IdentityRole("User"));
        }
    }
}
