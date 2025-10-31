using Restaurant_App.Entities.Concrete;

namespace Restaurant_App.Business.Abstract
{
    public interface IRatingService: IService<Rating>
    {
        Task<List<Rating>> GetRatingsWithProducts(int productId);
        Task<double> GetAverageRatingForProduct(int productId);
        Task<List<Rating>> GetRatingsWithComments(int commentId);
        Task<List<Rating>> GetRatingsByUserId(string userId);
        
    }
}
