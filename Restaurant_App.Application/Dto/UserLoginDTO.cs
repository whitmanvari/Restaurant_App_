namespace Restaurant_App.Application.Dto
{
    public class UserLoginDTO: BaseDTO
    {
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
}
