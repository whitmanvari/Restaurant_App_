using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Restaurant_App.Business.Abstract;
using Restaurant_App.Business.Concrete;
using Restaurant_App.Entities.Identity; // ApplicationUser için
using Restaurant_App.DataAccess.Abstract;
using Restaurant_App.DataAccess.Concrete;
using Restaurant_App.DataAccess.Concrete.EfCore;
using Restaurant_App.DataAccess.Concrete.Identity; // ApplicationIdentityDbContext için
using Microsoft.OpenApi.Models;
using System.Text;
using Restaurant_App.Application.IdentityErrors;

namespace Restaurant_App.WebAPI.Extensions
{
    public static class ServiceExtension
    {
        // Tüm Dal ve Manager (Service) katmanlarımızı DI'a ekler
        public static void AddApplicationServices(this IServiceCollection services)
        {
            services.AddScoped<ITableService, TableManager>();
            services.AddScoped<ITableDal, TableDal>();
            services.AddScoped<IProductService, ProductManager>();
            services.AddScoped<IProductDal, ProductDal>();
            services.AddScoped<ICategoryService, CategoryManager>();
            services.AddScoped<ICategoryDal, CategoryDal>();
            services.AddScoped<IOrderService, OrderManager>();
            services.AddScoped<IOrderDal, OrderDal>();
            services.AddScoped<IOrderInRestaurantService, OrderInRestaurantManager>();
            services.AddScoped<IOrderInRestaurantDal, OrderInRestaurantDal>();
            services.AddScoped<IRatingService, RatingManager>();
            services.AddScoped<IRatingDal, RatingDal>();
            services.AddScoped<ICommentService, CommentManager>();
            services.AddScoped<ICommentDal, CommentDal>();
            services.AddScoped<IReservationService, ReservationManager>();
            services.AddScoped<IReservationDal, ReservationDal>();
            services.AddScoped<ICartDal, CartDal>();
            services.AddScoped<ICartService, CartManager>();
            services.AddScoped<IAuthService, AuthManager>();
        }

        // Identity ve JWT servisleri
        public static void AddIdentityServices(this IServiceCollection services, IConfiguration config)
        {
            // DbContexts
            var connectionString = config.GetConnectionString("IdentityConnection");

            services.AddDbContext<RestaurantDbContext>(options =>
                options.UseSqlServer(connectionString));

            services.AddDbContext<ApplicationIdentityDbContext>(options =>
                options.UseSqlServer(connectionString));

            // Identity
            services.AddIdentity<ApplicationUser, IdentityRole>(options =>
            {
                options.Password.RequireDigit = true;
                options.Password.RequireLowercase = true;
                options.Password.RequireUppercase = true;
                options.Password.RequireNonAlphanumeric = true;
                options.Password.RequiredLength = 6;
                options.User.RequireUniqueEmail = true;
            })
            .AddEntityFrameworkStores<ApplicationIdentityDbContext>()
            .AddDefaultTokenProviders()
            .AddErrorDescriber <TurkishIdentityErrorDescriber>();

            // JWT ayarları 
            var key = config["DataAccess:Jwt:Key"];
            var issuer = config["DataAccess:Jwt:Issuer"];
            var audience = config["DataAccess:Jwt:Audience"];

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = issuer,
                    ValidAudience = audience,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key))
                };
            });

            services.AddAuthorization();
        }
        // Swagger'a "Authorize" butonu ekler
        public static void AddSwaggerGenWithAuth(this IServiceCollection services)
        {
            services.AddSwaggerGen(options =>
            {
                // Güvenlik Tanımını (Security Definition) 
                options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Description = "JWT Authorization header. (Örnek: \"Bearer {token}\")",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.Http, // 'ApiKey' yerine 'Http' kullanmak Bearer için daha doğrudur
                    Scheme = "bearer",
                    BearerFormat = "JWT"
                });

                // Güvenlik Gereksinimini (Security Requirement)
                // Bu, Swagger'ın her endpoint'e token'ı otomatik eklemesini sağlar
                options.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer" // Yukarıdaki "Bearer" tanımına referans ver
                            }
                        },
                        new string[] {}
                    }
                });
            });
        }
    }
}