using Restaurant_App.Business.Abstract;
using Restaurant_App.DataAccess.Abstract;
using Restaurant_App.Entities.Concrete;
using System.Linq.Expressions;

namespace Restaurant_App.Business.Concrete
{
    public class CommentManager : ICommentService, IService<Comment>
    {
        private readonly ICommentDal _commentDal;
        public CommentManager(ICommentDal commentDal)
        {
            _commentDal = commentDal;
        }


        public async Task Create(Comment entity)
        {
            await _commentDal.Create(entity);
        }

        public async Task Delete(Comment entity)
        {
            var comment = await _commentDal.GetById(entity.Id);
            if (comment != null)
            {
                await _commentDal.Delete(comment);
            }
            else
            {
                throw new ArgumentNullException("Böyle bir yorum yok!");
            }
        }

        public async Task<List<Comment>> GetAll(Expression<Func<Comment, bool>>? filter = null)
        {
            return await _commentDal.GetAll(filter);
        }

        public async Task<Comment> GetById(int id)
        {
            return await _commentDal.GetById(id);
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

        public async Task<Comment> GetOne(Expression<Func<Comment, bool>>? filter = null)
        {
            return await _commentDal.GetOne(filter);
        }

        public async Task Update(Comment entity)
        {
            await _commentDal.Update(entity);
        }

    }
}
