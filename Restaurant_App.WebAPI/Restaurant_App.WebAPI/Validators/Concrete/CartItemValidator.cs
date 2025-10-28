using FluentValidation;
using Restaurant_App.WebAPI.Dto;
using Restaurant_App.WebAPI.Validators.Abstract;
using Restaurant_App.WebAPI.ViewModels.Concrete;

namespace Restaurant_App.WebAPI.Validators.Concrete
{
    public class CartItemValidator : BaseValidator<CartItemViewModel, CartItemDTO>
    {
        public CartItemValidator()
        {
            ValidateWhenDataExists(() =>
            {
                RuleFor(x => x.Data!.ProductId)
                .GreaterThan(0)
                    .WithMessage("Ürün seçimi zorunludur!");

                RuleFor(x => x.Data!.Quantity)
                    .GreaterThan(0)
                        .WithMessage("Miktar 0'dan büyük olmalıdır!")
                    .LessThanOrEqualTo(20)
                        .WithMessage("Miktar 20'den fazla olamaz!");

                RuleFor(x => x.Data!.Price)
                    .GreaterThan(0)
                        .WithMessage("Fiyat 0'dan büyük olmalıdır!");
            });
        }
    }
}
