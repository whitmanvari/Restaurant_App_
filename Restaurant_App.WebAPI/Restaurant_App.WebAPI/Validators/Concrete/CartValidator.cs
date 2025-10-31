using FluentValidation;
using Restaurant_App.Entities.Dto;
using Restaurant_App.WebAPI.Validators.Abstract;
using Restaurant_App.WebAPI.ViewModels.Concrete;

namespace Restaurant_App.WebAPI.Validators.Concrete
{
    public class CartValidator: BaseValidator<CartViewModel, CartDTO>
    {
        public CartValidator()
        {
            ValidateWhenDataExists(() =>
            {
                RuleFor(x => x.Data!.Items)
                    .NotEmpty()
                        .WithMessage("Sepet en az bir ürün içermelidir!");

                RuleForEach(x => x.Data!.Items)
                    .ChildRules(item =>
                    {
                        item.RuleFor(i => i.Quantity)
                            .GreaterThan(0)
                                .WithMessage("Ürün adedi 0'dan büyük olmalıdır!");
                    });
            });
        }
    }
}
