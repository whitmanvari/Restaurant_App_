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

            try
            {
                context.Database.Migrate();
                SeedCategories(context);
                SeedProducts(context);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"SEED ERROR: {ex.Message}");
            }
        }

        private static void SeedCategories(RestaurantDbContext context)
        {
            if (!context.Categories.Any())
            {
                var categories = new List<Category>
                {
                    new() { Name = "Ana Yemekler", Description = "Izgara ve tava lezzetleri" },
                    new() { Name = "Çorbalar", Description = "Sıcak başlangıçlar" },
                    new() { Name = "Tatlılar", Description = "Geleneksel ve modern tatlılar" },
                    new() { Name = "İçecekler", Description = "Soğuk ve sıcak içecekler" },
                    new() { Name = "Salatalar", Description = "Taze mevsim yeşillikleri" },
                    new() { Name = "Makarnalar", Description = "İtalyan usulü makarnalar" },
                    new() { Name = "Burgerler", Description = "Ev yapımı burgerler" }
                };
                context.Categories.AddRange(categories);
                context.SaveChanges();
            }
        }

        private static void SeedProducts(RestaurantDbContext context)
        {
            if (!context.Products.Any())
            {
                var cats = context.Categories.ToList();
                var main = cats.First(c => c.Name == "Ana Yemekler");
                var soup = cats.First(c => c.Name == "Çorbalar");
                var dessert = cats.First(c => c.Name == "Tatlılar");
                var drink = cats.First(c => c.Name == "İçecekler");
                var salad = cats.First(c => c.Name == "Salatalar");
                var pasta = cats.First(c => c.Name == "Makarnalar");
                var burger = cats.First(c => c.Name == "Burgerler");

                var products = new List<Product>
                {
                    // --- ANA YEMEKLER ---
                    new() {
                        Name = "Kuzu Tandır",
                        Price = 480,
                        Description = "Ağır ateşte pişmiş kuzu, iç pilav ile.",
                        Ingredients = "Kuzu eti, Pirinç, Baharatlar",
                        CategoryId = main.Id,
                        Allergic = Allergic.None,
                        Images = [ new() { Url = "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800" } ]
                    },
                    new() {
                        Name = "Izgara Köfte",
                        Price = 320,
                        Description = "Dana kıyma, özel baharatlar, piyaz ile.",
                        Ingredients = "Dana Kıyma, Ekmek İçi, Soğan, Yumurta",
                        CategoryId = main.Id,
                        Allergic = Allergic.Gluten | Allergic.Eggs,
                        Images = [ new() { Url = "https://images.unsplash.com/photo-1529042410759-befb1204b468?q=80&w=800" } ]
                    },
                    new() {
                        Name = "Lokum Bonfile",
                        Price = 650,
                        Description = "Tereyağında mühürlenmiş dana bonfile.",
                        Ingredients = "Dana Bonfile, Tereyağı, Deniz Tuzu",
                        CategoryId = main.Id,
                        Allergic = Allergic.Dairy,
                        Images = [ new() { Url = "https://images.unsplash.com/photo-1558030006-d3597421dc53?q=80&w=800" } ]
                    },

                    // --- BURGERLER ---
                    new() {
                        Name = "LUNA Burger",
                        Price = 380,
                        Description = "180gr köfte, karamelize soğan, cheddar.",
                        Ingredients = "Burger Ekmeği, Dana Köfte, Cheddar, Soğan",
                        CategoryId = burger.Id,
                        Allergic = Allergic.Gluten | Allergic.Dairy | Allergic.Sesame,
                        Images = [ new() { Url = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800" } ]
                    },

                    // --- MAKARNALAR ---
                    new() {
                        Name = "Fettuccine Alfredo",
                        Price = 290,
                        Description = "Kremalı mantar soslu fettuccine.",
                        Ingredients = "Makarna, Krema, Mantar, Parmesan",
                        CategoryId = pasta.Id,
                        Allergic = Allergic.Gluten | Allergic.Dairy,
                        Images = [ new() { Url = "https://images.unsplash.com/photo-1645112416940-910933dc6915?q=80&w=800" } ]
                    },

                    // --- SALATALAR ---
                    new() {
                        Name = "Sezar Salata",
                        Price = 240,
                        Description = "Izgara tavuk, kruton, parmesan.",
                        Ingredients = "Marul, Tavuk, Kruton, Parmesan, Sezar Sos",
                        CategoryId = salad.Id,
                        Allergic = Allergic.Gluten | Allergic.Dairy | Allergic.Eggs,
                        Images = [ new() { Url = "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?q=80&w=800" } ]
                    },

                    // --- TATLILAR ---
                    new() {
                        Name = "Fıstıklı Baklava",
                        Price = 220,
                        Description = "Gaziantep usulü, bol fıstıklı.",
                        Ingredients = "Un, Fıstık, Şeker, Tereyağı",
                        CategoryId = dessert.Id,
                        Allergic = Allergic.Gluten | Allergic.Nuts | Allergic.Dairy,
                        Images = [ new() { Url = "https://images.unsplash.com/photo-1623683723775-a6eb742a88a7?q=80&w=800" } ]
                    },
                    new() {
                        Name = "San Sebastian",
                        Price = 200,
                        Description = "Akışkan kıvamlı yanık cheesecake.",
                        Ingredients = "Peynir, Krema, Yumurta, Şeker",
                        CategoryId = dessert.Id,
                        Allergic = Allergic.Dairy | Allergic.Eggs | Allergic.Gluten,
                        Images = [ new() { Url = "https://images.unsplash.com/photo-1562685413-d1c35032895b?q=80&w=800" } ]
                    },

                    // --- İÇECEKLER ---
                    new() {
                        Name = "Ev Yapımı Limonata",
                        Price = 80,
                        Description = "Taze nane ile.",
                        Ingredients = "Limon, Su, Şeker, Nane",
                        CategoryId = drink.Id,
                        Allergic = Allergic.None,
                        Images = [ new() { Url = "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800" } ]
                    }
                };
                context.Products.AddRange(products);
                context.SaveChanges();
            }
        }
    }
}