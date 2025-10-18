using Microsoft.EntityFrameworkCore;
using Restaurant_App.DataAccess.Abstract;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Restaurant_App.DataAccess.Concrete
{
    public class GenericRepository<T, TContext> : IRepository<T> where T : class where TContext : DbContext, new()
    {
        public async Task Create(T entity)
        {
            await using var context = new TContext();
            if (entity != null)
            {
                await context.Set<T>().AddAsync(entity);
                await context.SaveChangesAsync();
            }
            else
            {
                throw new ArgumentNullException(nameof(entity)); // Varlık null ise ArgumentNullException fırlat
            }
        }

        public async Task Delete(T entity)
        {
            await using var context = new TContext();
            if (entity != null)
            {
                context.Set<T>().Remove(entity);
                await context.SaveChangesAsync();
            }
            else
            {
                throw new ArgumentNullException(nameof(entity));
            }
        }

        public async Task<List<T>> GetAll(Expression<Func<T, bool>>? filter = null)
        {
            await using var context = new TContext();
            return filter == null
                ? await context.Set<T>().ToListAsync()
                : await context.Set<T>().Where(filter).ToListAsync();

        }

        public async Task<T> GetById(int id)
        {
            await using var context = new TContext();
            var result = await context.Set<T>().FindAsync(id);
            return result ?? throw new Exception("Kayıt bulunamadı!");
        }

        public async Task<T> GetOne(Expression<Func<T, bool>>? filter = null)
        {
            await using var context = new TContext();
            if (filter != null)
            {
                var result = await context.Set<T>().FirstOrDefaultAsync(filter);
                return result ?? throw new Exception("Kayıt bulunamadı!");
            }
            throw new Exception("Filtre belirtilmelidir!");
        }

        public async Task Update(T entity)
        {
            await using var context = new TContext();
            if (entity != null)
            {
                context.Set<T>().Update(entity);
                await context.SaveChangesAsync();
            }
            else
            {
                throw new ArgumentNullException(nameof(entity));
            }
        }
    }
}
