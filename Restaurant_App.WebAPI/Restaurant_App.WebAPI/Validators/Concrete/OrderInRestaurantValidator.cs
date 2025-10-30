using Restaurant_App.WebAPI.Dto;
using Restaurant_App.WebAPI.Validators.Abstract;
using Restaurant_App.WebAPI.ViewModels.Concrete;

namespace Restaurant_App.WebAPI.Validators.Concrete
{
    public class OrderInRestaurantValidator: BaseValidator<OrderInRestaurantViewModel, OrderInRestaurantDTO>
    {
        public OrderInRestaurantValidator()
        {
            
        }
    }
}
