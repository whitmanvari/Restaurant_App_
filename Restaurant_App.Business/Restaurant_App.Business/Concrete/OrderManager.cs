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
    public class OrderManager : IOrderService, IService<Order>
    {
        private readonly IOrderDal _orderDal;
        public OrderManager(IOrderDal orderDal)
        {
             _orderDal = orderDal;
        }
        public async Task Create(Order order)
        {
            await _orderDal.Create(order);
        }

        public async Task Delete(Order order)
        {
            await _orderDal.Delete(order);
        }

        public async Task<List<Order>> GetAll(Expression<Func<Order, bool>>? filter = null)
        {
            return await _orderDal.GetAll(filter);
        }

        public async Task<Order> GetById(int id)
        {
            return await _orderDal.GetById(id);
        }

        public async Task<Order> GetOne(Expression<Func<Order, bool>>? filter = null)
        {
            return await _orderDal.GetOne(filter);
        }

        public async Task<Order?> GetOrderDetails(int orderId)
        {
            return await _orderDal.GetOrderDetails(orderId);
        }

        public async Task<List<Order>> GetOrdersByUserId(string userId)
        {
            return await _orderDal.GetOrdersByUserId(userId);
        }

        public async Task Update(Order order)
        {
            await _orderDal.Update(order);
        }
    }
}
