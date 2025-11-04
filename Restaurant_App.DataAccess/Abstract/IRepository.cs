using System.Linq.Expressions;

namespace Restaurant_App.DataAccess.Abstract
{
    public interface IRepository<T>
    {
        Task<T> GetById(int id);
        Task<T> GetOne(Expression<Func<T, bool>>? filter = null);
        Task<List<T>> GetAll(Expression<Func<T, bool>>? filter = null);
        Task Create(T entity);
        Task Update(T entity);
        Task Delete(T entity);
    }
}
