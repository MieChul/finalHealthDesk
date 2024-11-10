namespace HealthDesk.Core;

public interface IUserRepository : IGenericRepository<User>
{
    Task<User> GetByUsernameAsync(string username);
    Task<User> GetByEmailOrMobileAsync(string emailOrMobile, bool isEmail = false);
}
