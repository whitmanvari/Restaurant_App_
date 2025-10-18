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
        Task<List<Order>> GetOrdersByUserId(string userId);
        Task<Order?> GetOrderDetails(int orderId);
    }
}
