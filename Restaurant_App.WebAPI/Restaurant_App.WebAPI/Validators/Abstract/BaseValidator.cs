using FluentValidation;
using Restaurant_App.WebAPI.ViewModels.Abstract;

namespace Restaurant_App.WebAPI.Validators.Abstract
{
    public abstract class BaseValidator<TViewModel, TDto> : AbstractValidator<TViewModel>
        where TViewModel : BaseViewModel<TDto>
        where TDto : class
    {
        protected void ValidateWhenDataExists(Action ruleBuilder)
        {
            When(x => x.Data != null, ruleBuilder);
        }
    }
}
