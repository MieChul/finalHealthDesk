using HealthDesk.Core;
using MongoDB.Driver;

namespace HealthDesk.Infrastructure;

 public class RefreshTokenRepository : GenericRepository<RefreshToken>, IRefreshTokenRepository
    {
        public RefreshTokenRepository(MongoDbContext context) : base(context, "RefreshTokens") { }

        public async Task<RefreshToken> GetByTokenAsync(string token) =>
            await GetByDynamicPropertyAsync("Token", token);

        public async Task RevokeTokenAsync(string token)
        {
            var filter = Builders<RefreshToken>.Filter.Eq(rt => rt.Token, token);
            var update = Builders<RefreshToken>.Update.Set(rt => rt.IsRevoked, true);
            await UpdateOneAsync(filter, update);
        }

        public async Task DeleteByUserIdAsync(string userId) =>
            await DeleteManyAsync(rt => rt.UserId == userId);
    }