using Restaurant_App.WebAPI.Dto;
using Restaurant_App.WebAPI.Validators.Abstract;
using Restaurant_App.WebAPI.ViewModels.Concrete;

namespace Restaurant_App.WebAPI.Validators.Concrete
{
    public class OrderItemValidator: BaseValidator<OrderItemViewModel, OrderItemDTO>
    {
        public OrderItemValidator()
        {
            
        }
    }
}
