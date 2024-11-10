using HealthDesk.Core;

namespace HealthDesk.Infrastructure;

public class UserRepository : GenericRepository<User>, IUserRepository
    {
        public UserRepository(MongoDbContext context) : base(context, "Users") { }

        public async Task<User> GetByUsernameAsync(string username) =>
            await GetByDynamicPropertyAsync("username", username);

        public async Task<User> GetByEmailOrMobileAsync(string emailOrMobile, bool isEmail = false) =>
            await GetByDynamicPropertyAsync(isEmail ? "email" : "mobile", emailOrMobile);
    }
