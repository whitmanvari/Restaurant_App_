using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Restaurant_App.DataAccess.Concrete.EfCore;
using Restaurant_App.Entities.Concrete;

namespace Restaurant_App.DataAccess.Concrete.Seed
{
    public static class SeedDatabase
    {
        /// Veritabanını başlangıç verileri ile dolduruyoruz.
        public static void SeedData(this IServiceProvider serviceProvider)
        {
            using var scope = serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<RestaurantDbContext>();

            // Bekleyen migration'ları uyguluyoruz
            context.Database.Migrate();

            // Kategori ve ürün verilerini ekliyoruz
            SeedCategories(context);
            SeedProducts(context);
        }

        private static void SeedCategories(RestaurantDbContext context)
        {
            // Eğer hiç kategori yoksa
            if (!context.Categories.Any())
            {
                var categories = new List<Category>
                {
                    new() { Name = "Ana Yemekler" },
                    new() { Name = "Çorbalar" },
                    new() { Name = "Tatlılar" },
                    new() { Name = "İçecekler" },
                    new() { Name = "Salatalar" },
                    new() { Name = "Başlangıçlar" }
                };

                context.Categories.AddRange(categories);
                context.SaveChanges();
            }
        }


        private static void SeedProducts(RestaurantDbContext context)
        {
            // Eğer hiç ürün yoksa
            if (!context.Products.Any())
            {
                var categories = context.Categories.ToList();

                var mainCourses = categories.First(c => c.Name == "Ana Yemekler");
                var soups = categories.First(c => c.Name == "Çorbalar");
                var desserts = categories.First(c => c.Name == "Tatlılar");
                var drinks = categories.First(c => c.Name == "İçecekler");
                var salads = categories.First(c => c.Name == "Salatalar");
                var appetizers = categories.First(c => c.Name == "Başlangıçlar");

                var products = new List<Product>
                {
                    new() {
                        Name = "Kuzu Tandır",
                        Price = 280.00,
                        Description = "24 saat marine edilmiş kuzu tandır, fırında özel pişirim",
                        CategoryId = mainCourses.Id,
                        Images = 
                        [
                            new() { ImageUrl = "kuzu_tandir.jpg" }
                        ]
                     },
                    new() {
                        Name = "Dana Şiş",
                        Price = 220.00,
                        Description = "Közde pişmiş dana şiş, közlenmiş biber ve domates ile",
                        CategoryId = mainCourses.Id,
                        Images = 
                        [
                            new() { ImageUrl = "dana_sis.jpg" }
                        ]
                        
                    },
                     new() {
                        Name = "Levrek Buğulama",
                        Price = 180.00,
                        Description = "Taze levrek, sebzeler ve baharatlarla buğulama",
                        CategoryId = mainCourses.Id,
                        Images = 
                        [
                            new() { ImageUrl = "levrek_bugulama.jpg" }
                        ]
                    },
                    new() {
                        Name = "Izgara Tavuk",
                        Price = 200,
                        Description = "Baharatlı ızgara tavuk göğsü, yanında sebzeler ile servis edilir.",
                        CategoryId = mainCourses.Id,
                        Images =
                        [
                            new() { ImageUrl = "izgara_tavuk_1.jpg" },
                            new() { ImageUrl = "izgara_tavuk_2.jpg" }
                        ]
                    },
                    new() {
                        Name = "Köfte",
                        Price = 210,
                        Description = "Ev yapımı köfteler, pilav ve mevsim salata ile birlikte.",
                        CategoryId = mainCourses.Id,
                        Images =
                        [
                            new() { ImageUrl = "kofte_1.jpg" }
                        ]
                    },
                    new() {
                        Name = "Mercimek Çorbası",
                        Price = 95,
                        Description = "Klasik Türk mercimek çorbası, limon eşliğinde.",
                        CategoryId = soups.Id,
                        Images =
                        [
                            new() { ImageUrl = "mercimek_corbasi.jpg" }
                        ]
                    },
                    new() {
                        Name = "Ezogelin Çorbası",
                        Price = 95,
                        Description = "Geleneksel ezogelin çorbası, naneli ve limonlu.",
                        CategoryId = soups.Id,
                        Images =
                        [
                            new() { ImageUrl = "ezogelin_corbasi.jpg" }
                        ]
                    },
                    new() {
                        Name = "Baklava",
                        Price = 180,
                        Description = "Cevizli geleneksel tatlı, kaymak ile servis edilir.",
                        CategoryId = desserts.Id,
                        Images =
                        [
                            new() { ImageUrl = "baklava.jpg" }
                        ]
                    },
                    new() {
                        Name = "Künefe",
                        Price = 200,
                        Description = "Antep fıstıklı sıcak künefe, dondurma ile birlikte.",
                        CategoryId = desserts.Id,
                        Images =
                        [
                            new() { ImageUrl = "kunefe.jpg" }
                        ]
                    },
                    new() {
                        Name = "Ayran",
                        Price = 40,
                        Description = "Soğuk yoğurt içeceği, taze naneli.",
                        CategoryId = drinks.Id,
                        Images =
                        [
                            new() { ImageUrl = "ayran.jpg" }
                        ]
                    },
                    new() {
                        Name = "Kola",
                        Price = 45,
                        Description = "Soğuk kola, buzlu.",
                        CategoryId = drinks.Id,
                        Images =
                        [
                            new() { ImageUrl = "kola.jpg" }
                        ]
                    },
                    new() {
                        Name = "Çoban Salata",
                        Price = 90,
                        Description = "Taze sebzelerle hazırlanan geleneksel salata.",
                        CategoryId = salads.Id,
                        Images =
                        [
                            new() { ImageUrl = "coban_salata.jpg" }
                        ]
                    },
                    new() {
                        Name = "Humus",
                        Price = 75,
                        Description = "Nohut püresi, zeytinyağı ve kimyon ile.",
                        CategoryId = appetizers.Id,
                        Images =
                        [
                            new() { ImageUrl = "humus.jpg" }
                        ]
                    }
                };

                context.Products.AddRange(products);
                context.SaveChanges();
            }
        }
    }
}