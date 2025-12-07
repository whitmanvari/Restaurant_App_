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
            // --- SANDBOX AYARLARI ---
            var options = new Options
            {
                ApiKey = "sandbox-8ap79vMKaKa4j6YgnJoXkAgw5E8zthR0",
                SecretKey = "EybI3wJlTntT3tfL4OePeBew7e5WQhX0",
                BaseUrl = "https://sandbox-api.iyzipay.com"
            };

            // Fiyat Formatı: Nokta ile ayrılmalı (Örn: "150.50")
            // InvariantCulture bunu garanti eder.
            string priceStr = model.Price.ToString(CultureInfo.InvariantCulture);

            var request = new CreatePaymentRequest
            {
                Locale = Locale.TR.ToString(),
                ConversationId = Guid.NewGuid().ToString(),
                Price = priceStr,
                PaidPrice = priceStr,
                Currency = Currency.TRY.ToString(),
                Installment = 1,
                BasketId = string.IsNullOrEmpty(model.BasketId) ? Guid.NewGuid().ToString() : model.BasketId,
                PaymentChannel = PaymentChannel.WEB.ToString(),
                PaymentGroup = PaymentGroup.PRODUCT.ToString(),

                PaymentCard = new PaymentCard
                {
                    CardHolderName = model.CardHolderName,
                    CardNumber = model.CardNumber?.Replace(" ", "").Trim(),
                    ExpireMonth = model.ExpireMonth,
                    ExpireYear = model.ExpireYear,
                    Cvc = model.Cvc,
                    RegisterCard = 0
                },

                // Dummy Müşteri Bilgileri (Sandbox için zorunlu alanlar)
                Buyer = new Buyer
                {
                    Id = "BY789",
                    Name = "Sandbox",
                    Surname = "User",
                    GsmNumber = "+905350000000",
                    Email = "email@email.com",
                    IdentityNumber = "74300864791",
                    LastLoginDate = "2015-10-05 12:43:35",
                    RegistrationDate = "2013-04-21 15:12:09",
                    RegistrationAddress = "Nispetiye Cad",
                    Ip = "85.34.78.112",
                    City = "Istanbul",
                    Country = "Turkey",
                    ZipCode = "34732"
                },
                BillingAddress = new Address
                {
                    ContactName = "Jane Doe",
                    City = "Istanbul",
                    Country = "Turkey",
                    Description = "Nispetiye Cad",
                    ZipCode = "34732"
                },
                ShippingAddress = new Address
                {
                    ContactName = "Jane Doe",
                    City = "Istanbul",
                    Country = "Turkey",
                    Description = "Nispetiye Cad",
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
                        Price = priceStr 
                    }
                }
            };

            return await Task.Run(() => Payment.Create(request, options));
        }
    }
}