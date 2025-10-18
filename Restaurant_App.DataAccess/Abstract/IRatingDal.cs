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
        List<Rating> GetRatingsWithProducts(int productId);
        double GetAverageRatingForProduct(int productId);
        List<Rating> GetRatingsWithComments(int commentId);
        List<Rating> GetRatingsByUserId(string userId);

    }
}
