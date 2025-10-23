using Restaurant_App.Entities.Concrete;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Restaurant_App.Business.Abstract
{
    public interface IRatingService
    {
        Task<List<Rating>> GetRatingsWithProducts(int productId);
        Task<double> GetAverageRatingForProduct(int productId);
        Task<List<Rating>> GetRatingsWithComments(int commentId);
        Task<List<Rating>> GetRatingsByUserId(string userId);
        Task<Rating> GetByRatingId(int ratingId);
        Task<Rating> GetOneRating(Expression<Func<Rating, bool>>? filter = null);
        Task<List<Rating>> GetAllRatings(Expression<Func<Rating, bool>>? filter = null);
        Task CreateRating(Rating rating);
        Task UpdateRating(Rating rating);
        Task DeleteRating(Rating rating);
    }
}
