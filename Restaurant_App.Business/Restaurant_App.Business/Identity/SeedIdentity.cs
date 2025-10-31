using Microsoft.AspNetCore.Identity;

namespace Restaurant_App.Business.Identity
{
    public static class SeedIdentity
    {
        public static async Task Seed(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, IConfiguration configuration)
        {
            // --- Admin ---
            var adminUsername = configuration["DataAccess:AdminUser:username"];
            var adminPassword = configuration["DataAccess:AdminUser:password"];
            var adminEmail = configuration["DataAccess:AdminUser:email"];
            var adminRole = configuration["DataAccess:AdminUser:role"];

            if (!await roleManager.RoleExistsAsync(adminRole))
                await roleManager.CreateAsync(new IdentityRole(adminRole));

            if (await userManager.FindByEmailAsync(adminEmail) == null)
            {
                var adminUser = new ApplicationUser()
                {
                    UserName = adminUsername,
                    Email = adminEmail,
                    FullName = "Admin User",
                    EmailConfirmed = true
                };
                await userManager.CreateAsync(adminUser, adminPassword);
                await userManager.AddToRoleAsync(adminUser, adminRole);
            }

            // --- Normal User ---
            var userRole = "User";
            if (!await roleManager.RoleExistsAsync(userRole))
                await roleManager.CreateAsync(new IdentityRole(userRole));

            var normalUserEmail = "user@example.com";
            if (await userManager.FindByEmailAsync(normalUserEmail) == null)
            {
                var normalUser = new ApplicationUser()
                {
                    UserName = "user",
                    Email = normalUserEmail,
                    FullName = "Normal User",
                    EmailConfirmed = true
                };
                await userManager.CreateAsync(normalUser, "User123");
                await userManager.AddToRoleAsync(normalUser, userRole);
            }
        }
    }
}
