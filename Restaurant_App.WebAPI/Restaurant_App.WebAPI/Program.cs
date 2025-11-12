using FluentValidation.AspNetCore;
using Restaurant_App.WebAPI.Extensions;
using Restaurant_App.Application.Mapping; // AutoMapperProfile için
using Restaurant_App.Application.Validators.Concrete;
using Restaurant_App.DataAccess.Concrete.Seed; // Validator için

var builder = WebApplication.CreateBuilder(args);

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy =>
                      {
                          policy.WithOrigins("http://localhost:5173") // React uygulası adresi
                                .AllowAnyHeader()
                                .AllowAnyMethod();
                      });
});

// Services
builder.Services.AddEndpointsApiExplorer(); // Swagger
builder.Services.AddSwaggerGenWithAuth(); // Swagger auth
builder.Services.AddApplicationServices(); // DAL + Manager
builder.Services.AddIdentityServices(builder.Configuration); // Identity + JWT

// AutoMapper 
builder.Services.AddAutoMapper(typeof(AutoMapperProfile));

// FluentValidation 
builder.Services.AddControllers()
    .AddFluentValidation(fv => fv.RegisterValidatorsFromAssemblyContaining<CartItemValidator>());

var app = builder.Build();

//  Seed işlemleri
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;

    // EF Core Seed
    services.SeedData();

    // Identity Seed
    await app.SeedIdentity();
}

// Middleware Pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors(MyAllowSpecificOrigins);
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();