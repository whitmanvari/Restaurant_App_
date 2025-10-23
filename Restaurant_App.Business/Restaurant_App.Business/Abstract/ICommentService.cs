using Restaurant_App.Entities.Concrete;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Restaurant_App.Business.Abstract
{
    public interface ICommentService
    {
        Task<List<Comment>> GetCommentsByProductId(int productId);
        Task<List<Comment>> GetCommentsByUserId(string userId);
        Task<List<Comment>> GetCommentsWithRatingsByProductId(int productId);
        Task AddComment(Comment comment);
        Task DeleteComment(int commentId);
        Task UpdateComment(Comment comment);
    }
}
