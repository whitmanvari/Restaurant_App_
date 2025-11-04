using Restaurant_App.Application.Validators.Abstract;
using Restaurant_App.Application.Dto;

namespace Restaurant_App.Application.Validators.Concrete
{
    public class ReservationValidator : BaseValidator<ReservationDTO>
    {
        public ReservationValidator()
        {
            NotEmptyString(x => x.CustomerName, "Müşteri adı zorunludur!", 100);
            MustBeValidPhone(x => x.CustomerPhone);
            DateCannotBePast(x => x.ReservationDate);
            QuantityMustBePositive(x => x.NumberOfGuests);
        }
    }
}

