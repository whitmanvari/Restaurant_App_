using Restaurant_App.Entities.Concrete;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Restaurant_App.DataAccess.Abstract
{
    public interface IRatingDal: IRepository<Rating>
    {
        Task<List<Rating>> GetRatingsWithProducts(int productId);
        Task<double> GetAverageRatingForProduct(int productId);
        Task<List<Rating>> GetRatingsWithComments(int commentId);
        Task<List<Rating>> GetRatingsByUserId(string userId);

    }
}
