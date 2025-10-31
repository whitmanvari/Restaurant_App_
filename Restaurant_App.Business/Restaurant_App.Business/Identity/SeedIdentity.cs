using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;

namespace Restaurant_App.Business.Identity
{
    public static class SeedIdentity
    {
        public static async Task Seed(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager,IConfiguration configuration)
        {
            var adminUsername = configuration["DataAccess:AdminUser:username"];
            var adminPassword = configuration["DataAccess:AdminUser:password"];
            var adminEmail = configuration["DataAccess:AdminUser:email"];
            var adminRole = configuration["DataAccess:AdminUser:role"];

            if (!await roleManager.RoleExistsAsync(adminRole))
                await roleManager.CreateAsync(new IdentityRole(adminRole));

            var existingAdmin = await userManager.FindByEmailAsync(adminEmail);
            if (existingAdmin == null)
            {
                var adminUser = new ApplicationUser
                {
                    UserName = adminUsername,
                    Email = adminEmail,
                    FullName = "Admin User",
                    EmailConfirmed = true
                };
                var result = await userManager.CreateAsync(adminUser, adminPassword);
                if (!result.Succeeded)
                {
                    var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                    throw new System.Exception($"Admin yaratımı başarısız oldu: {errors}");
                }

                await userManager.AddToRoleAsync(adminUser, adminRole);
            }
            else
            {
                if (!await userManager.IsInRoleAsync(existingAdmin, adminRole))
                    await userManager.AddToRoleAsync(existingAdmin, adminRole);
            }

            // --- Normal User ---
            var userRole = "User";
            if (!await roleManager.RoleExistsAsync(userRole))
                await roleManager.CreateAsync(new IdentityRole(userRole));

            var normalUserEmail = "user@example.com";
            var existingUser = await userManager.FindByEmailAsync(normalUserEmail);
            if (existingUser == null)
            {
                var normalUser = new ApplicationUser
                {
                    UserName = "user",
                    Email = normalUserEmail,
                    FullName = "Normal User",
                    EmailConfirmed = true
                };
                var resultUser = await userManager.CreateAsync(normalUser, "User123!");
                if (!resultUser.Succeeded)
                {
                    var errors = string.Join(", ", resultUser.Errors.Select(e => e.Description));
                    throw new System.Exception($"Kullanıcı yaratımı başarısız oldu: {errors}");
                }

                await userManager.AddToRoleAsync(normalUser, userRole);
            }
            else
            {
                if (!await userManager.IsInRoleAsync(existingUser, userRole))
                    await userManager.AddToRoleAsync(existingUser, userRole);
            }
        }
    }
}
