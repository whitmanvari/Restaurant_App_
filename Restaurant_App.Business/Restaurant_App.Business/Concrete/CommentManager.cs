using Restaurant_App.Business.Abstract;
using Restaurant_App.DataAccess.Abstract;
using Restaurant_App.Entities.Concrete;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Restaurant_App.Business.Concrete
{
    public class CommentManager : ICommentService
    {
        private readonly ICommentDal _commentDal;
        public CommentManager(ICommentDal commentDal)
        {
            _commentDal = commentDal;
        }

        public async Task AddComment(Comment comment)
        {
            await _commentDal.Create(comment);
        }

        public async Task DeleteComment(int commentId)
        {
            var comment = await _commentDal.GetById(commentId);
            if (comment != null)
            {
                await _commentDal.Delete(comment);
            }
            else
            {
                throw new ArgumentNullException("Böyle bir yorum yok!");
            }
        }

        public async Task<List<Comment>> GetCommentsByProductId(int productId)
        {   
            return await _commentDal.GetCommentsByProductId(productId);
        }

        public async Task<List<Comment>> GetCommentsByUserId(string userId)
        {
            return await _commentDal.GetCommentsByUserId(userId);
        }

        public async Task<List<Comment>> GetCommentsWithRatingsByProductId(int productId)
        {
            return await _commentDal.GetCommentsWithRatingsByProductId(productId);
        }

        public async Task UpdateComment(Comment comment)
        {
            await _commentDal.Update(comment);
        }
    }
}
