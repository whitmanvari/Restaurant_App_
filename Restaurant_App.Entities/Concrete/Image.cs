using Restaurant_App.Entities.Abstract;
using System.ComponentModel.DataAnnotations.Schema;


namespace Restaurant_App.Entities.Concrete
{
    [Table("Image")]
    public class Image : BaseEntity
    {
        public string? ImageUrl { get; set; }
        public int ProductId { get; set; }
        public Product? Product { get; set; }
    }
}
