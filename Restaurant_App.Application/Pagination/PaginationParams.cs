
namespace Restaurant_App.Application.Pagination
{
    public class PaginationParams
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 6; // Her sayfada 6 ürün
        public string? SearchTerm { get; set; }
        public string? Category { get; set; } // Kategori filtresi
        public int? ExcludeAllergens { get; set; } //İstenmeyen alerjenlerin toplam değeri
    }
}
