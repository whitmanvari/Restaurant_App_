using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Restaurant_App.DataAccess.Concrete.EfCore;
using Restaurant_App.Entities.Concrete;
using Restaurant_App.Entities.Enums;

namespace Restaurant_App.DataAccess.Concrete.Seed
{
    public static class SeedDatabase
    {
        public static void SeedData(this IServiceProvider serviceProvider)
        {
            using var scope = serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<RestaurantDbContext>();

            context.Database.Migrate();

            SeedCategories(context);
            SeedProducts(context);
        }

        private static void SeedCategories(RestaurantDbContext context)
        {
            if (!context.Categories.Any())
            {
                var categories = new List<Category>
                {
                    new() { Name = "Ana Yemekler", Description = "Doyurucu lezzetler" },
                    new() { Name = "Çorbalar", Description = "Sıcak başlangıçlar" },
                    new() { Name = "Tatlılar", Description = "Geleneksel tatlılar" },
                    new() { Name = "İçecekler", Description = "Soğuk ve sıcak içecekler" },
                    new() { Name = "Salatalar", Description = "Taze mevsim yeşillikleri" },
                    new() { Name = "Başlangıçlar", Description = "Atıştırmalıklar" }
                };
                context.Categories.AddRange(categories);
                context.SaveChanges();
            }
        }

        private static void SeedProducts(RestaurantDbContext context)
        {
            // Eğer ürün yoksa ekle
            if (!context.Products.Any())
            {
                var categories = context.Categories.ToList();
                var main = categories.First(c => c.Name == "Ana Yemekler");
                var desserts = categories.First(c => c.Name == "Tatlılar");
                var drinks = categories.First(c => c.Name == "İçecekler");
                var soups = categories.First(c => c.Name == "Çorbalar");

                var products = new List<Product>
                {
                    new() {
                        Name = "Kuzu Tandır",
                        Price = 450,
                        Description = "24 saat ağır ateşte pişmiş kuzu eti.",
                        Ingredients = "Kuzu eti, Pirinç, Tereyağı, Özel Baharatlar", 
                        CategoryId = main.Id,
                        Allergic = Allergic.None,
                        Images = [ new() { Url = "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800" } ]
                    },
                    new() {
                        Name = "Izgara Tavuk",
                        Price = 280,
                        Description = "Özel marinasyonlu tavuk göğsü.",
                        Ingredients = "Tavuk Göğsü, Zeytinyağı, Kekik, Sarımsak", 
                        CategoryId = main.Id,
                        Allergic = Allergic.None,
                        Images = [ new() { Url = "https://images.unsplash.com/photo-1532550907401-a500c9a57435?q=80&w=800" } ]
                    },
                    new() {
                        Name = "Fıstıklı Baklava",
                        Price = 220,
                        Description = "Antep fıstıklı, bol tereyağlı.",
                        Ingredients = "Un, Antep Fıstığı, Tereyağı, Şeker, Yumurta, Nişasta", 
                        CategoryId = desserts.Id,
                        Allergic = Allergic.Gluten | Allergic.Nuts | Allergic.Dairy | Allergic.Eggs | Allergic.Wheat,
                        Images = [ new() { Url = "https://images.unsplash.com/photo-1623683723775-a6eb742a88a7?q=80&w=800" } ]
                    },
                    new() {
                        Name = "Kasap Köfte",
                        Price = 320,
                        Description = "Dana kıyma ve özel baharatlar.",
                        Ingredients = "Dana Kıyma, Ekmek İçi, Soğan, Yumurta, Kimyon", 
                        CategoryId = main.Id,
                        Allergic = Allergic.Gluten | Allergic.Eggs | Allergic.Wheat,
                        Images = [ new() { Url = "https://images.unsplash.com/photo-1529042410759-befb1204b468?q=80&w=800" } ]
                    },
                    new() {
                        Name = "Mercimek Çorbası",
                        Price = 120,
                        Description = "Süzme mercimek çorbası.",
                        Ingredients = "Kırmızı Mercimek, Soğan, Havuç, Patates, Un", 
                        CategoryId = soups.Id,
                        Allergic = Allergic.Gluten | Allergic.Wheat,
                        Images = [ new() { Url = "https://images.unsplash.com/photo-1547592166-23acbe34001b?q=80&w=800" } ]
                    }
                };
                context.Products.AddRange(products);
                context.SaveChanges();
            }
        }
    }
}