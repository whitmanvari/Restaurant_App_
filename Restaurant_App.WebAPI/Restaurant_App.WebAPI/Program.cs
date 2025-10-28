using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Restaurant_App.Business.Abstract;
using Restaurant_App.Business.Concrete;
using Restaurant_App.DataAccess.Abstract;
using Restaurant_App.DataAccess.Concrete;
using Restaurant_App.DataAccess.Concrete.EfCore;
using Restaurant_App.WebAPI.Identity;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerUI;
using FluentValidation;
using FluentValidation.AspNetCore;
using Restaurant_App.DataAccess.Concrete.Seed;
using Restaurant_App.DataAccess.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

//ConnectionString
var connectionString = builder.Configuration.GetConnectionString("IdentityConnection");

//DBContext
builder.Services.AddDbContext<RestaurantDbContext>(options =>
    options.UseSqlServer(connectionString));

//Identity
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequiredLength = 6;

    options.Lockout.MaxFailedAccessAttempts = 5;
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
    options.Lockout.AllowedForNewUsers = true;

    options.User.RequireUniqueEmail = true;
    options.SignIn.RequireConfirmedEmail = true;
})
    .AddEntityFrameworkStores<ApplicationIdentityDbContext>()
    .AddDefaultTokenProviders();

////Fluent Validations
//builder.Services.AddControllers()
//    .AddFluentValidation(fv =>
//    {
//        fv.RegisterValidatorsFromAssemblyContaining<GenericViewModelValidator>();
//    });

//Cookie Ayarları
builder.Services.ConfigureApplicationCookie(options =>
{
    options.LoginPath = "/account/login";
    options.LogoutPath = "/account/logout";
    options.AccessDeniedPath = "/account/accessdenied";
    options.SlidingExpiration = true;
    options.ExpireTimeSpan = TimeSpan.FromMinutes(50);
});

//Dependency Injection Table
builder.Services.AddScoped<ITableService, TableManager>();
builder.Services.AddScoped<ITableDal, TableDal>();

//Product
builder.Services.AddScoped<IProductService, ProductManager>();
builder.Services.AddScoped<IProductDal, ProductDal>();

//Category
builder.Services.AddScoped<ICategoryService, CategoryManager>();
builder.Services.AddScoped<ICategoryDal, CategoryDal>();

//Order
builder.Services.AddScoped<IOrderService, OrderManager>();
builder.Services.AddScoped<IOrderDal, OrderDal>();

//OrderInRestaurant
builder.Services.AddScoped<IOrderInRestaurantService, OrderInRestaurantManager>();
builder.Services.AddScoped<IOrderInRestaurantDal, OrderInRestaurantDal>();

//Rating
builder.Services.AddScoped<IRatingService, RatingManager>();
builder.Services.AddScoped<IRatingDal, RatingDal>();

//Comment
builder.Services.AddScoped<ICommentService, CommentManager>();
builder.Services.AddScoped<ICommentDal, CommentDal>();

//Reservation
builder.Services.AddScoped<IReservationService, ReservationManager>();
builder.Services.AddScoped<IReservationDal, ReservationDal>();

//Cart
builder.Services.AddScoped<ICartDal, CartDal>();
builder.Services.AddScoped<ICartService, CartManager>();

//Controllers
builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();
builder.Services.AddDbContext<ApplicationIdentityDbContext>(options =>
    options.UseSqlServer(connectionString, b =>
        b.MigrationsAssembly("Restaurant_App.WebAPI")));

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.Services.SeedData();
}

// Middleware
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    var configuration = scope.ServiceProvider.GetRequiredService<IConfiguration>();

    await SeedIdentity.Seed(userManager, roleManager, configuration); // Hem admin hem user burada oluşturulacak
}

app.Run();
