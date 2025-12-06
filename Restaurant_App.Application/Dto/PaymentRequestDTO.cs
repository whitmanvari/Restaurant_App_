using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Restaurant_App.Application.Dto
{
    public class PaymentRequestDTO
    {
        public string CardHolderName { get; set; } = string.Empty;
        public string CardNumber { get; set; } = string.Empty;
        public string ExpireMonth { get; set; } = string.Empty;
        public string ExpireYear { get; set; } = string.Empty;
        public string Cvc { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string BasketId { get; set; } = string.Empty; // Sipariş Numarası olabilir

        // Müşteri Bilgileri 
        public string BuyerId { get; set; } = string.Empty;
        public string BuyerName { get; set; } = string.Empty;
        public string BuyerSurname { get; set; } = string.Empty;
        public string BuyerEmail { get; set; } = string.Empty;
        public string BuyerIdentityNumber { get; set; } = "11111111111"; // Zorunlu alan, test için sabit
        public string BuyerAddress { get; set; } = string.Empty;
        public string BuyerCity { get; set; } = string.Empty;
        public string BuyerCountry { get; set; } = "Turkey";
    }
}
