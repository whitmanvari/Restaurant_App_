using Microsoft.EntityFrameworkCore;
using Restaurant_App.DataAccess.Abstract;
using System.Linq.Expressions;


namespace Restaurant_App.DataAccess.Concrete
{
    public class GenericRepository<T, TContext> : IRepository<T>
        where T : class
        where TContext : DbContext
    {
        protected readonly TContext _context;

        public GenericRepository(TContext context)
        {
            _context = context;
        }

        public async Task Create(T entity)
        {
            if (entity == null)
                throw new ArgumentNullException(nameof(entity));

            await _context.Set<T>().AddAsync(entity);
            await _context.SaveChangesAsync();
        }

        public async Task Delete(T entity)
        {
            if (entity == null)
                throw new ArgumentNullException(nameof(entity));

            _context.Set<T>().Remove(entity);
            await _context.SaveChangesAsync();
        }

        //Comment tarafında getAll'u eziyorum
        public virtual async Task<List<T>> GetAll(Expression<Func<T, bool>>? filter = null)
        {
            return filter == null
                ? await _context.Set<T>().ToListAsync()
                : await _context.Set<T>().Where(filter).ToListAsync();
        }

        public async Task<T> GetById(int id)
        {
            return await _context.Set<T>().FindAsync(id);
        }

        public async Task<T> GetOne(Expression<Func<T, bool>>? filter = null)
        {
            if (filter == null)
                throw new Exception("Filtre belirtilmelidir!");

            var result = await _context.Set<T>().FirstOrDefaultAsync(filter);
            return result ?? throw new Exception("Kayıt bulunamadı!");
        }

        public async Task Update(T entity)
        {
            if (entity == null)
                throw new ArgumentNullException(nameof(entity));

            _context.Set<T>().Update(entity);
            await _context.SaveChangesAsync();
        }
    }
}
