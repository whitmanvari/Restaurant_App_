using Restaurant_App.Application.Validators.Abstract;
using Restaurant_App.Application.Dto;

namespace Restaurant_App.Application.Validators.Concrete
{
    public class OrderInRestaurantValidator : BaseValidator<OrderInRestaurantDTO>
    {
        public OrderInRestaurantValidator()
        {
            ListMustNotBeEmpty(x => x.OrderItems, "Sipariş kalemleri listesi boş olamaz!");
            RuleForEach(x => x.OrderItems)
                .SetValidator(new OrderItemInRestaurantValidator());
        }
    }
}
