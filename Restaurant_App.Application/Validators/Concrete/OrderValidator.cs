using Restaurant_App.Application.Validators.Abstract;
using Restaurant_App.Application.Dto;

namespace Restaurant_App.Application.Validators.Concrete
{
    public class OrderValidator : BaseValidator<OrderDTO>
    {
        public OrderValidator()
        {
            NotEmptyString(x => x.UserId, "Kullanıcı ID boş geçilemez!");
            NotEmptyString(x => x.PaymentId, "Ödeme ID boş geçilemez!");
            MustBeValidEmail(x => x.Email);
            NotEmptyString(x => x.Address, "Adres boş geçilemez!", 100);
            MustBeValidPhone(x => x.Phone);
            PriceMustBePositive(x => x.TotalAmount);
            ListMustNotBeEmpty(x => x.Items, "Sipariş kalemleri listesi boş geçilemez!");
            RuleForEach(x => x.Items)
                .SetValidator(new OrderItemValidator());
        }
    }
}

