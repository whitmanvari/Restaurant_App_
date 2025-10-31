using FluentValidation;
using Restaurant_App.Entities.Dto;
using Restaurant_App.WebAPI.Validators.Abstract;
using Restaurant_App.WebAPI.ViewModels.Concrete;

namespace Restaurant_App.WebAPI.Validators.Concrete
{
    public class OrderItemInRestaurantValidator : BaseValidator<OrderItemInRestaurantViewModel, OrderItemInRestaurantDTO>
    {
        public OrderItemInRestaurantValidator()
        {
            ValidateWhenDataExists(() =>
            {
                RuleFor(x => x.Data!.ProductId)
                    .GreaterThan(0)
                        .WithMessage("Ürün seçimi zorunludur!");

                RuleFor(x => x.Data!.Quantity)
                    .GreaterThan(0)
                        .WithMessage("Miktar 0'dan büyük olmalıdır!");

                RuleFor(x => x.Data!.Price)
                    .GreaterThan(0)
                        .WithMessage("Fiyat 0'dan büyük olmalıdır!");
            });

            RuleFor(x => x.Data)
                .NotNull()
                    .WithMessage("Sipariş ürünü bilgisi boş olamaz!");

        }
    }
}
