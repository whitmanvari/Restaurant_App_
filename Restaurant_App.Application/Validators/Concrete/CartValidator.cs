using Restaurant_App.Application.Validators.Abstract;
using Restaurant_App.Application.Dto;

namespace Restaurant_App.Application.Validators.Concrete
{
    public class CartValidator : BaseValidator<CartDTO>
    {
        public CartValidator()
        {
            ListMustNotBeEmpty(x => x.Items, "Sepet ürünleri boş geçilemez!");
            RuleForEach(x => x.Items)
                .SetValidator(new CartItemValidator());
        }
    }
}
