using Microsoft.EntityFrameworkCore;
using Restaurant_App.Entities.Concrete;


namespace Restaurant_App.DataAccess.Concrete.EfCore
{
    public class RestaurantDbContext : DbContext
    {
        public RestaurantDbContext(DbContextOptions<RestaurantDbContext> options)
            : base(options)
        {
        }
        public RestaurantDbContext()
        {
            
        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer("Server=(localdb)\\MSSQLLocalDB;Database=RestaurantDb;uid=sa;pwd=1;TrustServerCertificate=True");
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Product>()
                .HasOne(p => p.Category)
                .WithMany(c => c.Products)
                .HasForeignKey(p => p.CategoryId);

            modelBuilder.Entity<Product>()
                .HasMany(p => p.Images)
                .WithOne(i => i.Product)
                .HasForeignKey(i => i.ProductId);

            modelBuilder.Entity<Product>()
                .HasMany(p => p.OrderItems)
                .WithOne(oi => oi.Product)
                .HasForeignKey(oi => oi.ProductId);

            modelBuilder.Entity<Product>()
                .HasMany(p => p.OrderItemsInRestaurant)
                .WithOne(oi => oi.Product)
                .HasForeignKey(oi => oi.ProductId);

            modelBuilder.Entity<Rating>()
                .HasOne(r => r.Product)
                .WithMany(p => p.Ratings)
                .HasForeignKey(r => r.ProductId);

            modelBuilder.Entity<Rating>()
                .HasOne(r => r.MostValuableProduct)
                .WithMany()
                .HasForeignKey(r => r.MostValuableProductId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Rating>()
                .HasOne(r => r.LeastValuableProduct)
                .WithMany()
                .HasForeignKey(r => r.LeastValuableProductId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ProductCategory>()
                .HasKey(pc => new { pc.ProductId, pc.CategoryId });
           
            modelBuilder.Entity<ProductCategory>()
               .HasOne(pc => pc.Product)
               .WithMany(p => p.ProductCategory)
               .HasForeignKey(pc => pc.ProductId)
               .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ProductCategory>()
               .HasOne(pc => pc.Category)
               .WithMany(c => c.ProductCategory)
               .HasForeignKey(pc => pc.CategoryId)
               .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Cart>()
                .HasMany(c => c.CartItems)
                .WithOne(ci => ci.Cart)
                .HasForeignKey(ci => ci.CartId);


            modelBuilder.Entity<Category>()
                .HasMany(c => c.Products)
                .WithOne(p => p.Category)
                .HasForeignKey(p => p.CategoryId);
            //Her product birden fazla image içerebilir.
            //Her image bir producta bağlıdır.


            modelBuilder.Entity<Comment>()
                .HasOne(c => c.Rating)
                .WithMany(r => r.Comments)
                .HasForeignKey(c => c.RatingId);

            modelBuilder.Entity<Reservation>()
                .HasOne(r => r.Table)
                .WithMany(t => t.Reservations)
                .HasForeignKey(r => r.TableId);

            modelBuilder.Entity<Order>()
                .HasMany(o => o.OrderItems)
                .WithOne(oi => oi.Order)
                .HasForeignKey(oi => oi.OrderId);

            modelBuilder.Entity<OrderInRestaurant>()
                .HasMany(o => o.OrderItemsInRestaurant)
                .WithOne(oi => oi.OrderInRestaurant)
                .HasForeignKey(oi => oi.OrderInRestaurantId);

            modelBuilder.Entity<OrderItemInRestaurant>()
                .HasOne(oi => oi.Product)
                .WithMany(p => p.OrderItemsInRestaurant)
                .HasForeignKey(oi => oi.ProductId);

            modelBuilder.Entity<OrderItem>()
                .HasOne(oi => oi.Product)
                .WithMany(p => p.OrderItems)
                .HasForeignKey(oi => oi.ProductId);
        }
        public DbSet<Product> Products { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<ProductCategory> ProductCategories { get; set; }
        public DbSet<Image> Images { get; set; }
        public DbSet<Cart> Carts { get; set; }
        public DbSet<CartItem> CartItems { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Rating> Ratings { get; set; }
        public DbSet<Table> Tables { get; set; }
        public DbSet<Reservation> Reservations { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<OrderInRestaurant> OrdersInRestaurant { get; set; }
        public DbSet<OrderItemInRestaurant> OrderItemsInRestaurant { get; set; }
    }
}
