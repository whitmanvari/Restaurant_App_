using Microsoft.AspNetCore.Identity;

namespace Restaurant_App.WebAPI.Identity
{
    public static class SeedIdentity
    {
        public static async Task Seed(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, IConfiguration configuration)
        {
            var username = configuration["DataAccess:AdminUser:username"];
            var password = configuration["DataAccess:AdminUser:password"];
            var email = configuration["DataAccess:AdminUser:email"];
            var role = configuration["DataAccess:AdminUser:role"];
            if (await userManager.FindByEmailAsync(email) == null)
            {
                await roleManager.CreateAsync(new IdentityRole(role));

                var user = new ApplicationUser()
                {
                    UserName = username,
                    Email = email,
                    FullName = "Hazal Ilık",
                    EmailConfirmed = true
                };

                var result = await userManager.CreateAsync(user, password);

                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(user, role);
                }
            }
        }
    }
}
