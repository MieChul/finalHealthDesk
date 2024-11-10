using Microsoft.Extensions.Configuration;
using MongoDB.Driver;

namespace HealthDesk.Infrastructure;

public class MongoDbContext
    {
        private readonly IMongoDatabase _database;

        public MongoDbContext(IConfiguration configuration)
        {
            var connectionString = configuration.GetConnectionString("MongoDbConnection");
            var databaseName = configuration["MongoDbSettings:DatabaseName"];
            var client = new MongoClient(connectionString);
            _database = client.GetDatabase(databaseName);
        }

        public IMongoCollection<T> GetCollection<T>(string collectionName) =>
            _database.GetCollection<T>(collectionName);
    }