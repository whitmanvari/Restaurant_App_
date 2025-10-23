using Restaurant_App.Entities.Concrete;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Restaurant_App.Business.Abstract
{
    public interface IOrderService
    {
        Task<List<Order>> GetOrdersByUserId(string userId);
        Task<Order?> GetOrderDetails(int orderId);
        
    }
}
