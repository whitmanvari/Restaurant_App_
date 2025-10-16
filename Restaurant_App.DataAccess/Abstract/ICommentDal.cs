using Restaurant_App.Entities.Concrete;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Restaurant_App.DataAccess.Abstract
{
    public interface ICommentDal: IRepository<Comment>
    {
        List<Comment> GetCommentsByProductId(int productId);
        List<Comment> GetCommentsByUserId(string userId);
        List<Comment> GetCommentsWithRatingsByProductId(int productId);
        
    }
}
