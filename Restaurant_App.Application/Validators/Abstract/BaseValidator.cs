using FluentValidation;
using System.Linq.Expressions;

namespace Restaurant_App.Application.Validators.Abstract
{
    public abstract class BaseValidator<TDto> : AbstractValidator<TDto>
        where TDto : class
    {
        protected void QuantityMustBePositive(Expression<Func<TDto, int?>> expression)
        {
            RuleFor(expression)
                .NotNull()
                    .WithMessage("Miktar boş olamaz!")
                .GreaterThan(0)
                    .WithMessage("Miktar 0'dan büyük olmalıdır!");
        }
        protected void PriceMustBePositive(Expression<Func<TDto, decimal>> expression)
        {
            RuleFor(expression)
                .GreaterThan(0)
                    .WithMessage("Fiyat 0'dan büyük olmalıdır!");
        }
        protected void ListMustNotBeEmpty<TItem>(Expression<Func<TDto, IEnumerable<TItem>>> expression, string message)
        {
            RuleFor(expression)
                .NotNull()
                    .WithMessage(message)
                .NotEmpty()
                    .WithMessage(message);
        }
        protected void NotEmptyString(Expression<Func<TDto, string>> expression, string msg = "Bu alan boş olamaz!", int max = 200)
        {
            RuleFor(expression)
                .NotEmpty()
                    .WithMessage(msg)
                .MaximumLength(max)
                    .WithMessage($"Bu alan en fazla {max} karakter olabilir");
        }
        protected void MustBeValidEmail(Expression<Func<TDto, string>> expression)
        {
            RuleFor(expression)
                .EmailAddress()
                    .WithMessage("Geçerli bir email giriniz.");
        }
        protected void DateCannotBePast(Expression<Func<TDto, DateTime>> expression)
        {
            RuleFor(expression)
                // 15 dakikalık tolerans ekleniyor
                .GreaterThan(DateTime.Now.AddMinutes(-15))
                  .WithMessage("Geçmiş bir zamana rezervasyon yapılamaz. Lütfen ileri bir tarih seçin.");
        }
        protected void MustBeValidPhone(Expression<Func<TDto, string>> expression)
        {
            RuleFor(expression)
                .Matches(@"^\+?\d{10,15}$")
                .When(x => !string.IsNullOrEmpty(expression.Compile()(x))) // boşsa atla
                 .WithMessage("Telefon formatı geçerli değil.");
        }
        // Zorunlu Telefon (Boş geçilemez) 
        protected void MustBeRequiredPhone(Expression<Func<TDto, string>> expression)
        {
            RuleFor(expression)
                .NotEmpty()
                    .WithMessage("Telefon numarası zorunludur.")
                .Matches(@"^\+?\d{10,15}$")
                    .WithMessage("Geçerli bir telefon numarası giriniz (Örn: 5551234567).");
        }
        protected void MustBeValidCity(Expression<Func<TDto, string>> expression)
        {
            RuleFor(expression)
                .NotEmpty()
                    .WithMessage("Şehir bilgisi zorunludur.")
                .MinimumLength(2)
                    .WithMessage("Şehir adı çok kısa.");
        }
        

    }
}
