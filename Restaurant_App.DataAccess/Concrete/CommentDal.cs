using Microsoft.EntityFrameworkCore;
using Restaurant_App.DataAccess.Abstract;
using Restaurant_App.DataAccess.Concrete.EfCore;
using Restaurant_App.Entities.Concrete;

namespace Restaurant_App.DataAccess.Concrete
{
    public class CommentDal : GenericRepository<Comment, RestaurantDbContext>, ICommentDal
    {
        public CommentDal(RestaurantDbContext context) : base(context)
        {
        }

        public async Task<List<Comment>> GetCommentsByProductId(int productId)
        {
            return await _context.Comments
                    .Where(c => c.Rating.ProductId == productId)
                    .ToListAsync();
        }

        public async Task<List<Comment>> GetCommentsByUserId(string userId)
        {
            return await _context.Comments
                    .Where(c => c.UserId == userId)
                    .ToListAsync();
        }

        public async Task<List<Comment>> GetCommentsWithRatingsByProductId(int productId)
        {
            return await _context.Comments
                    .Include(c => c.Rating)
                    .Where(c => c.Rating.ProductId == productId)
                    .ToListAsync();
        }
    }
}