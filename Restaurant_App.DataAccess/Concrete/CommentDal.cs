using Microsoft.EntityFrameworkCore;
using Restaurant_App.DataAccess.Abstract;
using Restaurant_App.DataAccess.Concrete.EfCore;
using Restaurant_App.Entities.Concrete;

namespace Restaurant_App.DataAccess.Concrete
{
    public class CommentDal : GenericRepository<Comment, RestaurantDbContext>, ICommentDal
    {
        public async Task<List<Comment>> GetCommentsByProductId(int productId)
        {
            await using var context = new RestaurantDbContext();
            return await context.Comments
                    .Where(c => c.ProductId == productId)
                    .ToListAsync();
        }

        public async Task<List<Comment>> GetCommentsByUserId(string userId)
        {
            await using var context = new RestaurantDbContext();
            return await context.Comments
                    .Where(c => c.UserId == userId)
                    .ToListAsync();
        }

        public async Task<List<Comment>> GetCommentsWithRatingsByProductId(int productId)
        {
            await using var context = new RestaurantDbContext();
            return await context.Comments
                    .Include(c => c.Rating)
                    .Where(c => c.ProductId == productId)
                    .ToListAsync();
        }
    }
}
