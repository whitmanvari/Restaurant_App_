using Restaurant_App.Entities.Concrete;

namespace Restaurant_App.Business.Abstract
{
    public interface ICommentService
    {
        Task<List<Comment>> GetCommentsByProductId(int productId);
        Task<List<Comment>> GetCommentsByUserId(string userId);
        Task<List<Comment>> GetCommentsWithRatingsByProductId(int productId);
       
    }
}
