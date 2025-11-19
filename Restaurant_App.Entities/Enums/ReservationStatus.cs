
namespace Restaurant_App.Entities.Enums
{
    public enum ReservationStatus
    {
        Pending = 0,   // Onay Bekliyor (Varsayılan)
        Approved = 1,  // Onaylandı
        Rejected = 2,  // Reddedildi
        Cancelled = 3  // İptal Edildi (Kullanıcı tarafından)
    }
}
