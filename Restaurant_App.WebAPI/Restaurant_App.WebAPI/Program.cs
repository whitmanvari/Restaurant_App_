using FluentValidation.AspNetCore;
using Restaurant_App.WebAPI.Extensions;
using Restaurant_App.Application.Mapping; // AutoMapperProfile için
using Restaurant_App.Application.Validators.Concrete;
using Restaurant_App.DataAccess.Concrete.Seed; // Validator için

var builder = WebApplication.CreateBuilder(args);

// Servisleri ve Kimlik Doğrulamayı Extension metotları ile ekle
builder.Services.AddIdentityServices(builder.Configuration); // Identity, DbContexts ve JWT
builder.Services.AddApplicationServices(); // DALs & Managers

// AutoMapper 
builder.Services.AddAutoMapper(typeof(AutoMapperProfile));

// FluentValidation 
builder.Services.AddControllers()
    .AddFluentValidation(fv => fv.RegisterValidatorsFromAssemblyContaining<CartItemValidator>());

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGenWithAuth();

var app = builder.Build();

// Middleware Pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    // DataAccess katmanındaki Seed'i çalıştır
    using var scope = app.Services.CreateScope();
    scope.ServiceProvider.SeedData();
}

app.UseHttpsRedirection();
app.UseAuthentication(); 
app.UseAuthorization();
app.MapControllers();

// WebAPI katmanındaki Identity Seed'i çalıştır
await app.SeedIdentity();

app.Run();