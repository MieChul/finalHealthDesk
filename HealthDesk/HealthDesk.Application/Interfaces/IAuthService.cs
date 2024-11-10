using HealthDesk.Core;
using Microsoft.AspNetCore.Http;

namespace HealthDesk.Application;

public interface IAuthService
    {
        Task<User> Authenticate(string username, string password);
        Task SetTokenCookies(HttpContext context, User user);
        Task<string> GenerateRefreshToken(string userId);
        Task<string?> RefreshAccessToken(string userId);
        Task InvalidateUserTokens(string userId);
    }