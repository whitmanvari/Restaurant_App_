using Restaurant_App.Application.Validators.Abstract;
using Restaurant_App.Application.Dto;

namespace Restaurant_App.Application.Validators.Concrete
{
    public class OrderItemValidator : BaseValidator<OrderItemDTO>
    {
        public OrderItemValidator()
        {
            QuantityMustBePositive(x => x.Quantity);
            PriceMustBePositive(x => x.Price);
        }
    }
}
