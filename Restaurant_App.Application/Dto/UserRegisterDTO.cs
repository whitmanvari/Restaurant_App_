namespace Restaurant_App.Application.Dto
{
    public class UserRegisterDTO
    {
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string ConfirmPassword { get; set; } = string.Empty;
        public string Role { get; set; } = "User";
        public string? PhoneNumber { get; set; }
        public string? Address { get; set; }
        public string? City { get; set; }
    }
}
