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

                var main = cats.FirstOrDefault(c => c.Name == "Ana Yemekler");
                var soup = cats.FirstOrDefault(c => c.Name == "Çorbalar");
                var dessert = cats.FirstOrDefault(c => c.Name == "Tatlılar");
                var drink = cats.FirstOrDefault(c => c.Name == "İçecekler");
                var salad = cats.FirstOrDefault(c => c.Name == "Salatalar");
                var pasta = cats.FirstOrDefault(c => c.Name == "Makarnalar");
                var burger = cats.FirstOrDefault(c => c.Name == "Burgerler");

                if (main == null) return;

                var products = new List<Product>
                {
                    // --- ANA YEMEKLER ---
                    new() {
                        Name = "Kuzu Tandır",
                        Price = 480,
                        Description = "24 saat ağır ateşte pişmiş kuzu eti, iç pilav eşliğinde.",
                        Ingredients = "Kuzu Kol, Pirinç, Çam Fıstığı, Kuş Üzümü, Tereyağı",
                        CategoryId = main.Id,
                        Allergic = Allergic.Nuts | Allergic.Dairy,
                        Images = [ new() { Url = "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800" } ]
                    },
                    new() {
                        Name = "Lokum Bonfile",
                        Price = 650,
                        Description = "Özel dinlendirilmiş dana bonfile, tereyağında mühürlenmiş.",
                        Ingredients = "Dana Bonfile, Tereyağı, Deniz Tuzu, Taze Kekik, Bebek Patates",
                        CategoryId = main.Id,
                        Allergic = Allergic.Dairy,
                        // YENİ GÖRSEL: Izgara Et
                        Images = [ new() { Url = "https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=800" } ]
                    },
                    new() {
                        Name = "Izgara Köfte",
                        Price = 320,
                        Description = "Geleneksel tarifle hazırlanan dana kıyma köfte, piyaz ile.",
                        Ingredients = "Dana Kıyma, Ekmek İçi, Soğan, Maydanoz, Kimyon",
                        CategoryId = main.Id,
                        Allergic = Allergic.Gluten,
                        Images = [ new() { Url = "https://images.unsplash.com/photo-1529042410759-befb1204b468?q=80&w=800" } ]
                    },
                    new() {
                        Name = "Izgara Somon",
                        Price = 420,
                        Description = "Dışı hafifçe kızarmış, içi yumuşacık Norveç somonu. Izgara sebzeler eşliğinde.",
                        Ingredients = "Somon, Zeytinyağı, Limon, Taze Kekik",
                        CategoryId = main.Id,
                        Allergic = Allergic.Fish,
                        Images = [ new() { Url = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800" } ]
                    },
                    new() {
                        Name = "Mantarlı Risotto",
                        Price = 350,
                        Description = "İtalyan arborio pirinciyle hazırlanan kremsi risotto.",
                        Ingredients = "Arborio Pirinci, Mantar, Parmesan, Krema",
                        CategoryId = main.Id,
                        Allergic = Allergic.Dairy,
                        Images = [ new() { Url = "https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=800" } ]
                    },

                    // --- BURGERLER ---
                    new() {
                        Name = "LUNA Burger",
                        Price = 380,
                        Description = "180gr ev yapımı köfte, karamelize soğan ve trüflü mayonez.",
                        Ingredients = "Brioche Ekmeği, Dana Köfte, Cheddar, Karamelize Soğan, Trüf Sos",
                        CategoryId = burger.Id,
                        Allergic = Allergic.Gluten | Allergic.Dairy | Allergic.Eggs | Allergic.Sesame,
                        Images = [ new() { Url = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800" } ]
                    },
                    new() {
                        Name = "Smoky BBQ Burger",
                        Price = 410,
                        Description = "Dumanlı BBQ sos, cheddar ve çıtır bacon ile zenginleştirilmiş burger.",
                        Ingredients = "Dana Köfte, Cheddar, BBQ Sos, Bacon",
                        CategoryId = burger.Id,
                        Allergic = Allergic.Gluten | Allergic.Dairy,
                        Images = [ new() { Url = "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800" } ]
                    },


                    // --- MAKARNALAR ---
                   new() {
                        Name = "Spaghetti Bolognese",
                        Price = 280,
                        Description = "Geleneksel etli domates sosuyla hazırlanmış bolonez soslu spagetti.",
                        Ingredients = "Spaghetti, Dana Kıyma, Domates, Sarımsak",
                        CategoryId = pasta.Id,
                        Allergic = Allergic.Gluten,
                        Images = [ new() { Url = "https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=800" } ]
                    },

                    // --- SALATALAR ---
                    new() {
                        Name = "Sezar Salata",
                        Price = 240,
                        Description = "Izgara tavuk dilimleri ve orijinal sezar sos ile.",
                        Ingredients = "Marul, Izgara Tavuk, Kruton Ekmek, Parmesan, Sezar Sos",
                        CategoryId = salad.Id,
                        Allergic = Allergic.Gluten | Allergic.Dairy | Allergic.Eggs | Allergic.Fish,
                        Images = [ new() { Url = "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?q=80&w=800" } ]
                    },


                    // --- ÇORBALAR ---
                    new() {
                        Name = "Mercimek Çorbası",
                        Price = 120,
                        Description = "Kemik suyu ile pişirilmiş süzme mercimek çorbası.",
                        Ingredients = "Kırmızı Mercimek, Soğan, Havuç, Patates, Kemik Suyu",
                        CategoryId = soup.Id,
                        Allergic = Allergic.None,
                        Images = [ new() { Url = "https://images.unsplash.com/photo-1588553461521-3a015b6a8158?q=80&w=800" } ]
                    },
                    new() {
                        Name = "Kremalı Mantar Çorbası",
                        Price = 140,
                        Description = "Taze kültür mantarından hazırlanmış yoğun aromalı çorba.",
                        Ingredients = "Mantar, Krema, Un, Tereyağı",
                        CategoryId = soup.Id,
                        Allergic = Allergic.Dairy | Allergic.Gluten,
                        Images = [ new() { Url = "https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=800" } ]
                    },
                    
                    // --- TATLILAR ---
                    new() {
                        Name = "San Sebastian",
                        Price = 200,
                        Description = "İçi akışkan, üzeri karamelize yanık cheesecake.",
                        Ingredients = "Labne Peyniri, Krema, Yumurta, Şeker, Vanilya",
                        CategoryId = dessert.Id,
                        Allergic = Allergic.Dairy | Allergic.Eggs | Allergic.Gluten,
                        Images = [ new() { Url = "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=800" } ]
                    },
                    

                    // --- İÇECEKLER ---
                    new() {
                        Name = "Ev Yapımı Limonata",
                        Price = 80,
                        Description = "Taze nane yaprakları ve az şekerli ferahlatıcı lezzet.",
                        Ingredients = "Limon, Su, Şeker, Taze Nane, Buz",
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