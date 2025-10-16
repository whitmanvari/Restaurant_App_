using Restaurant_App.Entities.Concrete;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Restaurant_App.DataAccess.Abstract
{
    public interface IOrderDal: IRepository<Order>
    {
        List<Order> GetOrdersByUserId(string userId);
        Order GetOrderDetails(int orderId);
    }
}
