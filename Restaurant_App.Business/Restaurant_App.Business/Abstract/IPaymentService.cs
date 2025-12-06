using Iyzipay.Model;
using Restaurant_App.Application.Dto;

namespace Restaurant_App.Business.Abstract
{
    public interface IPaymentService
    {
        // Asenkron olarak Iyzico Payment sonucunu döner
        Task<Payment> PayWithIyzico(PaymentRequestDTO model);
    }
}