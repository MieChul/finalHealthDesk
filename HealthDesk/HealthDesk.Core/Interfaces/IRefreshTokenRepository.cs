namespace HealthDesk.Core;

public interface IRefreshTokenRepository : IGenericRepository<RefreshToken>
{
    Task<RefreshToken> GetByTokenAsync(string token);
    Task RevokeTokenAsync(string token);
    Task DeleteByUserIdAsync(string userId);
}
