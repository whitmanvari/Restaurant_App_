using Restaurant_App.Application.Validators.Abstract;
using Restaurant_App.Application.Dto;

namespace Restaurant_App.Application.Validators.Concrete
{
    public class RatingValidator: BaseValidator<RatingDTO>
    {
        public RatingValidator()
        {
            NotEmptyString(x => x.Comment, "Yorum yapılmadan puanlama yapılamaz!");
        }
    }
}
