using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Restaurant_App.DataAccess.Concrete.EfCore;
using Restaurant_App.Entities.Concrete;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Restaurant_App.DataAccess.Extensions
{
    public static class SeedExtensions
    {
        public static void SeedData(this IServiceProvider serviceProvider)
        {
            using var scope = serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<RestaurantDbContext>();

            // Apply pending migrations
            context.Database.Migrate();

            // Seed categories and products
            SeedCategories(context);
            SeedProducts(context);
        }

        private static void SeedCategories(RestaurantDbContext context)
        {
            if (!context.Categories.Any())
            {
                var categories = new List<Category>
                {
                    new() { Name = "Main Courses" },
                    new() { Name = "Soups" },
                    new() { Name = "Desserts" },
                    new() { Name = "Drinks" },
                    new() { Name = "Salads" },
                    new() { Name = "Appetizers" }
                };

                context.Categories.AddRange(categories);
                context.SaveChanges();
            }
        }

        private static void SeedProducts(RestaurantDbContext context)
        {
            if (!context.Products.Any())
            {
                var categories = context.Categories.ToList();

                var mainCourses = categories.First(c => c.Name == "Main Courses");
                var soups = categories.First(c => c.Name == "Soups");
                var desserts = categories.First(c => c.Name == "Desserts");
                var drinks = categories.First(c => c.Name == "Drinks");
                var salads = categories.First(c => c.Name == "Salads");
                var appetizers = categories.First(c => c.Name == "Appetizers");

                var products = new List<Product>
                {
                    new() {
                        Name = "Grilled Chicken",
                        Price = 180,
                        Description = "Spicy grilled chicken breast.",
                        CategoryId = mainCourses.Id,
                        Images =
                        [
                            new() { ImageUrl = "grilled_chicken_1.jpg" },
                            new() { ImageUrl = "grilled_chicken_2.jpg" }
                        ]
                    },
                    new() {
                        Name = "Meatballs",
                        Price = 160,
                        Description = "Homemade meatballs.",
                        CategoryId = mainCourses.Id,
                        Images =
                        [
                            new() { ImageUrl = "meatballs_1.jpg" }
                        ]
                    },
                    new() {
                        Name = "Lentil Soup",
                        Price = 70,
                        Description = "Classic Turkish lentil soup.",
                        CategoryId = soups.Id,
                        Images =
                        [
                            new() { ImageUrl = "lentil_soup.jpg" }
                        ]
                    },
                    new() {
                        Name = "Ezogelin Soup",
                        Price = 75,
                        Description = "Traditional ezogelin soup.",
                        CategoryId = soups.Id,
                        Images =
                        [
                            new() { ImageUrl = "ezogelin_soup.jpg" }
                        ]
                    },
                    new() {
                        Name = "Baklava",
                        Price = 120,
                        Description = "Walnut traditional dessert.",
                        CategoryId = desserts.Id,
                        Images =
                        [
                            new() { ImageUrl = "baklava.jpg" }
                        ]
                    },
                    new() {
                        Name = "Kunefe",
                        Price = 150,
                        Description = "Kunefe with pistachio.",
                        CategoryId = desserts.Id,
                        Images =
                        [
                            new() { ImageUrl = "kunefe.jpg" }
                        ]
                    },
                    new() {
                        Name = "Ayran",
                        Price = 30,
                        Description = "Cold yogurt drink.",
                        CategoryId = drinks.Id,
                        Images =
                        [
                            new() { ImageUrl = "ayran.jpg" }
                        ]
                    },
                    new() {
                        Name = "Cola",
                        Price = 25,
                        Description = "Cold cola.",
                        CategoryId = drinks.Id,
                        Images =
                        [
                            new() { ImageUrl = "cola.jpg" }
                        ]
                    }
                };

                context.Products.AddRange(products);
                context.SaveChanges();
            }
        }
    }
}