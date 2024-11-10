using System.Linq.Expressions;
using System.Reflection;
using HealthDesk.Core;
using MongoDB.Driver;

namespace HealthDesk.Infrastructure;

public class GenericRepository<T> : IGenericRepository<T> where T : BaseEntity
    {
        private readonly IMongoCollection<T> _collection;

        public GenericRepository(MongoDbContext context, string collectionName)
        {
            _collection = context.GetCollection<T>(collectionName);
        }

        public async Task<T> GetByIdAsync(string id) =>
            await _collection.Find(entity => entity.Id == id).FirstOrDefaultAsync();

        public async Task<IEnumerable<T>> GetAllAsync() =>
            await _collection.Find(_ => true).ToListAsync();

        public async Task AddAsync(T entity) =>
            await _collection.InsertOneAsync(entity);

        public async Task UpdateAsync(T entity) =>
            await _collection.ReplaceOneAsync(e => e.Id == entity.Id, entity);

        public async Task DeleteAsync(string id) =>
            await _collection.DeleteOneAsync(e => e.Id == id);

        public async Task<T> GetByDynamicPropertyAsync(string propertyName, object value)
        {
            var propertyInfo = typeof(T).GetProperty(propertyName, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance);
            if (propertyInfo == null)
            {
                throw new ArgumentException($"Property '{propertyName}' does not exist on type '{typeof(T)}'");
            }

            var filter = Builders<T>.Filter.Eq(propertyInfo.Name, value);
            return await _collection.Find(filter).FirstOrDefaultAsync();
        }

         // Add UpdateOneAsync method
        public async Task UpdateOneAsync(FilterDefinition<T> filter, UpdateDefinition<T> update) =>
            await _collection.UpdateOneAsync(filter, update);

        // Add DeleteManyAsync method
        public async Task DeleteManyAsync(Expression<Func<T, bool>> filterExpression) =>
            await _collection.DeleteManyAsync(filterExpression);
    }