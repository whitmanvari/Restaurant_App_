using Restaurant_App.Application.Validators.Abstract;
using Restaurant_App.Application.Dto;

namespace Restaurant_App.Application.Validators.Concrete
{
    public class CommentValidator : BaseValidator<CommentDTO>
    {
        public CommentValidator()
        {
            NotEmptyString(x => x.Text, "Yorum boş olamaz!", 500);
        }
    }
}
