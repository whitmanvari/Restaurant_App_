using Iyzipay;
using Iyzipay.Model;
using Iyzipay.Request;
using Microsoft.Extensions.Configuration;
using Restaurant_App.Application.Dto;
using Restaurant_App.Business.Abstract;
using System.Globalization;

namespace Restaurant_App.Business.Concrete
{
    public class PaymentManager : IPaymentService
    {
        private readonly IConfiguration _configuration;

        public PaymentManager(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<Payment> PayWithIyzico(PaymentRequestDTO model)
        {
            // --- DEBUG LOGLARI ---
            Console.WriteLine("--- IYZICO BAĞLANTISI BAŞLIYOR ---");

            // GEÇİCİ OLARAK ELLE YAZIYORUZ (Test bitince sileceğiz)
            var options = new Options
            {
                ApiKey = "sandbox-8ap79vMKaKa4j6YgnJoXkAgw5E8zthR0",    
                SecretKey = "EybI3wJlTntT3tfL4OePeBew7e5WQhX0", 
                BaseUrl = "https://sandbox-api.iyzipay.com" 
            };

            Console.WriteLine($"Kullanılan URL: {options.BaseUrl}");

            var request = new CreatePaymentRequest
            {
                Locale = Locale.TR.ToString(),
                ConversationId = Guid.NewGuid().ToString(),
                Price = model.Price.ToString("F2", new CultureInfo("en-US")), // "450.00" formatı
                PaidPrice = model.Price.ToString("F2", new CultureInfo("en-US")),
                Currency = Currency.TRY.ToString(),
                Installment = 1,
                BasketId = string.IsNullOrEmpty(model.BasketId) ? Guid.NewGuid().ToString() : model.BasketId,
                PaymentChannel = PaymentChannel.WEB.ToString(),
                PaymentGroup = PaymentGroup.PRODUCT.ToString(),

                PaymentCard = new PaymentCard
                {
                    CardHolderName = model.CardHolderName,
                    CardNumber = model.CardNumber?.Trim().Replace(" ", ""), // Ekstra güvenlik: Boşlukları temizle
                    ExpireMonth = model.ExpireMonth,
                    ExpireYear = model.ExpireYear,
                    Cvc = model.Cvc,
                    RegisterCard = 0
                },

                Buyer = new Buyer
                {
                    Id = string.IsNullOrEmpty(model.BuyerId) ? "Guest" : model.BuyerId,
                    Name = string.IsNullOrEmpty(model.BuyerName) ? "Misafir" : model.BuyerName,
                    Surname = string.IsNullOrEmpty(model.BuyerSurname) ? "Müşteri" : model.BuyerSurname,
                    GsmNumber = "+905350000000",
                    Email = string.IsNullOrEmpty(model.BuyerEmail) ? "guest@luna.com" : model.BuyerEmail,
                    IdentityNumber = "11111111110",
                    LastLoginDate = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"),
                    RegistrationDate = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"),
                    RegistrationAddress = "Nispetiye Mah. Aytar Cad. No:24",
                    Ip = "85.34.78.112",
                    City = "Istanbul",
                    Country = "Turkey",
                    ZipCode = "34732"
                },

                BillingAddress = new Address
                {
                    ContactName = "Test User",
                    City = "Istanbul",
                    Country = "Turkey",
                    Description = "Nispetiye Mah. Aytar Cad. No:24",
                    ZipCode = "34732"
                },

                ShippingAddress = new Address
                {
                    ContactName = "Test User",
                    City = "Istanbul",
                    Country = "Turkey",
                    Description = "Nispetiye Mah. Aytar Cad. No:24",
                    ZipCode = "34732"
                },

                BasketItems = new List<BasketItem>
                {
                    new BasketItem
                    {
                        Id = "BI101",
                        Name = "Sipariş Toplamı",
                        Category1 = "Gıda",
                        ItemType = BasketItemType.PHYSICAL.ToString(),
                        Price = model.Price.ToString(new CultureInfo("en-US"))
                    }
                }
            };

            return await Task.Run(() => Payment.Create(request, options));
        }
    }
}