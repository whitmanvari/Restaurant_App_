using Microsoft.EntityFrameworkCore;
using Restaurant_App.DataAccess.Concrete.EfCore;
using Restaurant_App.Entities.Concrete;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Restaurant_App.DataAccess.Concrete.Seed
{
    public class SeedDatabase
    {
        public static void Seed()
        {
            using (var context = new RestaurantDbContext())
            {
                // Bekleyen migration kontrolü
                if (context.Database.GetPendingMigrations().Count() == 0)
                {
                    // Kategorileri ekle
                    if (!context.Categories.Any())
                    {
                        context.Categories.AddRange(GetCategories());
                        context.SaveChanges();
                    }

                    // Ürünleri ve resimleri ekle
                    if (!context.Products.Any())
                    {
                        var categories = context.Categories.ToList();
                        var products = GetProducts(categories);

                        context.Products.AddRange(products);
                        context.SaveChanges();
                    }
                }
            }
        }

        private static List<Category> GetCategories()
        {
            return new List<Category>
            {
                new Category(){ Name = "Ana Yemekler"},
                new Category(){ Name = "Çorbalar"},
                new Category(){ Name = "Tatlılar"},
                new Category(){ Name = "İçecekler"},
                new Category(){ Name = "Salatalar"},
                new Category(){ Name = "Başlangıçlar"}
            };
        }

        private static List<Product> GetProducts(List<Category> categories)
        {
            var anaYemekler = categories.First(c => c.Name == "Ana Yemekler");
            var corbalar = categories.First(c => c.Name == "Çorbalar");
            var tatlılar = categories.First(c => c.Name == "Tatlılar");
            var icecekler = categories.First(c => c.Name == "İçecekler");
            var salatalar = categories.First(c => c.Name == "Salatalar");
            var baslangiclar = categories.First(c => c.Name == "Başlangıçlar");

            return new List<Product>
            {
                new Product(){
                    Name = "Izgara Tavuk",
                    Price = 180,
                    Description = "Baharatlı ızgara tavuk göğsü.",
                    CategoryId = anaYemekler.Id,
                    Images = new List<Image>
                    {
                        new Image(){ ImageUrl = "izgara_tavuk_1.jpg" },
                        new Image(){ ImageUrl = "izgara_tavuk_2.jpg" }
                    }
                },
                new Product(){
                    Name = "Köfte",
                    Price = 160,
                    Description = "Ev yapımı köfteler.",
                    CategoryId = anaYemekler.Id,
                    Images = new List<Image>
                    {
                        new Image(){ ImageUrl = "kofte_1.jpg" }
                    }
                },
                new Product(){
                    Name = "Mercimek Çorbası",
                    Price = 70,
                    Description = "Klasik Türk mercimek çorbası.",
                    CategoryId = corbalar.Id,
                    Images = new List<Image>
                    {
                        new Image(){ ImageUrl = "mercimek.jpg" }
                    }
                },
                new Product(){
                    Name = "Ezogelin Çorbası",
                    Price = 75,
                    Description = "Geleneksel ezogelin çorbası.",
                    CategoryId = corbalar.Id,
                    Images = new List<Image>
                    {
                        new Image(){ ImageUrl = "ezogelin.jpg" }
                    }
                },
                new Product(){
                    Name = "Baklava",
                    Price = 120,
                    Description = "Cevizli geleneksel tatlı.",
                    CategoryId = tatlılar.Id,
                    Images = new List<Image>
                    {
                        new Image(){ ImageUrl = "baklava.jpg" }
                    }
                },
                new Product(){
                    Name = "Künefe",
                    Price = 150,
                    Description = "Antep fıstıklı künefe.",
                    CategoryId = tatlılar.Id,
                    Images = new List<Image>
                    {
                        new Image(){ ImageUrl = "kunefe.jpg" }
                    }
                },
                new Product(){
                    Name = "Ayran",
                    Price = 30,
                    Description = "Soğuk yoğurt içeceği.",
                    CategoryId = icecekler.Id,
                    Images = new List<Image>
                    {
                        new Image(){ ImageUrl = "ayran.jpg" }
                    }
                },
                new Product(){
                    Name = "Kola",
                    Price = 25,
                    Description = "Soğuk kola.",
                    CategoryId = icecekler.Id,
                    Images = new List<Image>
                    {
                        new Image(){ ImageUrl = "kola.jpg" }
                    }
                },
                new Product(){
                    Name = "Çoban Salata",
                    Price = 90,
                    Description = "Taze sebzelerle hazırlanan salata.",
                    CategoryId = salatalar.Id,
                    Images = new List<Image>
                    {
                        new Image(){ ImageUrl = "coban_salata.jpg" }
                    }
                },
                new Product(){
                    Name = "Humus",
                    Price = 65,
                    Description = "Nohut püresi.",
                    CategoryId = baslangiclar.Id,
                    Images = new List<Image>
                    {
                        new Image(){ ImageUrl = "humus.jpg" }
                    }
                }
            };
        }
    }
}