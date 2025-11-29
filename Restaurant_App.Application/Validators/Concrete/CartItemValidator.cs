using Restaurant_App.Application.Dto;
using Restaurant_App.Application.Validators.Abstract;

namespace Restaurant_App.Application.Validators.Concrete
{
    public class CartItemValidator : BaseValidator<CartItemDTO>
    {
        public CartItemValidator()
        {
            QuantityMustBePositive(x => x.Quantity);
        }
    }
}
