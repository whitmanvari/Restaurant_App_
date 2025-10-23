using Restaurant_App.Business.Abstract;
using Restaurant_App.DataAccess.Abstract;
using Restaurant_App.Entities.Concrete;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Restaurant_App.Business.Concrete
{
    public class RatingManager : IRatingService
    {
        private readonly IRatingDal _ratingDal;
        public RatingManager(IRatingDal ratingDal)
        {
            _ratingDal = ratingDal;
        }
        public async Task CreateRating(Rating rating)
        {
            await _ratingDal.Create(rating);
        }

        public async Task DeleteRating(Rating rating)
        {
            await _ratingDal.Delete(rating);
        }

        public async Task<List<Rating>> GetAllRatings(Expression<Func<Rating, bool>>? filter = null)
        {
            return await _ratingDal.GetAll(filter);
        }

        public async Task<double> GetAverageRatingForProduct(int productId)
        {
            return await _ratingDal.GetAverageRatingForProduct(productId);
        }

        public async Task<Rating> GetByRatingId(int ratingId)
        {
            return await _ratingDal.GetById(ratingId);
        }

        public async Task<Rating> GetOneRating(Expression<Func<Rating, bool>>? filter = null)
        {
            return await _ratingDal.GetOne(filter);
        }

        public async Task<List<Rating>> GetRatingsByUserId(string userId)
        {
            return await _ratingDal.GetRatingsByUserId(userId);
        }

        public async Task<List<Rating>> GetRatingsWithComments(int commentId)
        {
            return await _ratingDal.GetRatingsWithComments(commentId);
        }

        public async Task<List<Rating>> GetRatingsWithProducts(int productId)
        {
            return await _ratingDal.GetRatingsWithProducts(productId);
        }

        public async Task UpdateRating(Rating rating)
        {
            await _ratingDal.Update(rating);
        }
    }
}
