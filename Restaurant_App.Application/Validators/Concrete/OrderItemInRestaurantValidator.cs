using Restaurant_App.Application.Validators.Abstract;
using Restaurant_App.Application.Dto;

namespace Restaurant_App.Application.Validators.Concrete
{
    public class OrderItemInRestaurantValidator : BaseValidator<OrderItemInRestaurantDTO>
    {
        public OrderItemInRestaurantValidator()
        {
            QuantityMustBePositive(x => x.Quantity);
            PriceMustBePositive(x => x.Price);
        }
    }
}
