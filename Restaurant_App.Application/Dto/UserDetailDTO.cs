

namespace Restaurant_App.Application.Dto
{
    public class UserDetailDTO
    {
        public string Id { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty; // Kullanıcının rolü (Admin/User)
        public DateTime CreatedDate { get; set; } // Ne zaman kayıt oldu? 
    }
}
