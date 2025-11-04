using Microsoft.EntityFrameworkCore;
using Restaurant_App.DataAccess.Abstract;
using Restaurant_App.DataAccess.Concrete.EfCore;
using Restaurant_App.Entities.Concrete;

namespace Restaurant_App.DataAccess.Concrete
{
    public class RatingDal : GenericRepository<Rating, RestaurantDbContext>, IRatingDal
    {
        public RatingDal(RestaurantDbContext context) : base(context)
        {
        }

        public async Task<double> GetAverageRatingForProduct(int productId)
        {
            return await _context.Ratings
                .Where(r => r.ProductId == productId)
                .Select(r => (int)r.Value)
                .DefaultIfEmpty(0)
                .AverageAsync();
        }

        public async Task<List<Rating>> GetRatingsByUserId(string userId)
        {
            return await GetAll(r => r.UserId == userId);
        }

        public async Task<List<Rating>> GetRatingsWithComments(int commentId)
        {
            return await GetAll(r => r.Comments.Any(c => c.Id == commentId));
        }

        public async Task<List<Rating>> GetRatingsWithProducts(int productId)
        {
            return await GetAll(r => r.ProductId == productId);
        }
    }
}