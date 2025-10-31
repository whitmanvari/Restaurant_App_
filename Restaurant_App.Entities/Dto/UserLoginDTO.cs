namespace Restaurant_App.Entities.Dto
{
    public class UserLoginDTO: BaseDTO
    {
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
}
