using System.Linq.Expressions;

namespace Restaurant_App.Business.Abstract
{
    public interface IService<T>
    {
        Task<T> GetById(int id);
        Task<T> GetOne(Expression<Func<T, bool>>? filter = null);
        Task<List<T>> GetAll(Expression<Func<T, bool>>? filter = null);
        Task Create(T entity);
        Task Update(T entity);
        Task Delete(T entity);
    }
}
