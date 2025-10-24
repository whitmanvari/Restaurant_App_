namespace Restaurant_App.WebAPI.Dto
{
    public class UserLoginDTO: BaseDTO
    {
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
}
