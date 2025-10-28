using FluentValidation;
using Restaurant_App.WebAPI.Dto;
using Restaurant_App.WebAPI.Validators.Abstract;
using Restaurant_App.WebAPI.ViewModels.Concrete;

namespace Restaurant_App.WebAPI.Validators.Concrete
{
    public class OrderValidator : BaseValidator<OrderViewModel, OrderDTO>
    {
        public OrderValidator()
        {
            ValidateWhenDataExists(() =>
            {
                RuleFor(x => x.Data!.OrderDate)
                    .LessThanOrEqualTo(DateTime.Now)
                        .WithMessage("Sipariş tarihi bugünden ileri olamaz!");

                RuleFor(x => x.Data!.Items)
                    .NotEmpty()
                        .WithMessage("Sipariş en az bir ürün içermelidir!");

                RuleFor(x => x.Data!.TotalAmount)
                    .GreaterThan(0)
                        .WithMessage("Toplam tutar 0'dan büyük olmalıdır!");
            });

            RuleFor(x => x.Data)
                .NotNull()
                    .WithMessage("Sipariş bilgisi boş olamaz!");
        }
    }
}

