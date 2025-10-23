using Restaurant_App.Entities.Concrete;

namespace Restaurant_App.DataAccess.Abstract
{
    public interface ICommentDal: IRepository<Comment>
    {
        Task<List<Comment>> GetCommentsByProductId(int productId);
        Task<List<Comment>> GetCommentsByUserId(string userId);
        Task<List<Comment>> GetCommentsWithRatingsByProductId(int productId);

    }
}
