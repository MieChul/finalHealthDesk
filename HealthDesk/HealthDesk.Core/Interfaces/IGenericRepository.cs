using System.Linq.Expressions;
using MongoDB.Driver;

namespace HealthDesk.Core;

 public interface IGenericRepository<T> where T : BaseEntity
    {
        Task<T> GetByIdAsync(string id);
        Task<IEnumerable<T>> GetAllAsync();
        Task AddAsync(T entity);
        Task UpdateAsync(T entity);
        Task DeleteAsync(string id);
        Task<T> GetByDynamicPropertyAsync(string propertyName, object value);
        Task UpdateOneAsync(FilterDefinition<T> filter, UpdateDefinition<T> update);

        // Add DeleteManyAsync method
        Task DeleteManyAsync(Expression<Func<T, bool>> filterExpression);
    }
