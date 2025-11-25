using FluentValidation.AspNetCore; 
using Restaurant_App.WebAPI.Extensions;
using Restaurant_App.Application.Mapping;
using Restaurant_App.Application.Validators.Concrete;
using Restaurant_App.DataAccess.Concrete.Seed;

var builder = WebApplication.CreateBuilder(args);

// Cors kuralı
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

// --- SERVİS KONTEYNERİ (IServiceCollection) ---

// 1. Temel MVC ve Web API Servisleri
builder.Services.AddControllers()
    .AddFluentValidation(fv => fv.RegisterValidatorsFromAssemblyContaining<CartItemValidator>());

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGenWithAuth();

// 2. Cors Yapılandırması
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy =>
                      {
                          policy.SetIsOriginAllowed(origin => new Uri(origin).Host == "localhost")
                                .AllowAnyHeader()
                                .AllowAnyMethod();
                      });
});

// 3. AutoMapper ve DI - Uygulama Servisleri
builder.Services.AddAutoMapper(typeof(AutoMapperProfile));
builder.Services.AddApplicationServices();
builder.Services.AddIdentityServices(builder.Configuration);


// --- UYGULAMAYI BAŞLATMA (WebApplication) ---

var app = builder.Build();

// 1. Seed işlemleri
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    services.SeedData();
    await app.SeedIdentity();
}

// 2. Middleware Pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// 3. Kimlik Doğrulama ve Yetkilendirme Middleware'leri
app.UseHttpsRedirection();
app.UseCors(MyAllowSpecificOrigins);

app.UseAuthentication();
app.UseAuthorization();

// 4. Endpoint Haritalama
app.MapControllers();

app.Run();