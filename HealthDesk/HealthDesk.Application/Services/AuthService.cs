using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using HealthDesk.Core;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace HealthDesk.Application;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IRefreshTokenRepository _refreshTokenRepository;
    private readonly IConfiguration _configuration;

    public AuthService(IUserRepository userRepository, IConfiguration configuration, IRefreshTokenRepository refreshTokenRepository)
    {
        _userRepository = userRepository;
        _configuration = configuration;
        _refreshTokenRepository = refreshTokenRepository;
    }

    public async Task<User> Authenticate(string username, string password)
    {
        var user = await _userRepository.GetByUsernameAsync(username);
        if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
        {
            return null;
        }

        return user; // Return user instead of token
    }
    public async Task<string> GenerateRefreshToken(string userId)
    {
        var refreshToken = new RefreshToken
        {
            UserId = userId,
            Token = Guid.NewGuid().ToString(),
            ExpiryDate = DateTime.UtcNow.AddDays(7) // Set expiration for refresh token
        };

        await _refreshTokenRepository.AddAsync(refreshToken);
        return refreshToken.Token;
    }

    public async Task InvalidateUserTokens(string userId) =>
               await _refreshTokenRepository.DeleteByUserIdAsync(userId);

    public async Task<string?> RefreshAccessToken(string userId)
    {
        // Validate the refresh token
        var tokenEntry = await _refreshTokenRepository.GetByDynamicPropertyAsync("UserId", userId);
        if (tokenEntry == null || tokenEntry.ExpiryDate <= DateTime.UtcNow || tokenEntry.IsRevoked)
        {
            await InvalidateUserTokens(userId);
            return null;// Invalid, expired, or revoked token
        }

        // Retrieve the user and generate a new access token
        var user = await _userRepository.GetByIdAsync(tokenEntry.UserId);
        return user != null ? GenerateToken(user) : null;
    }

    public async Task SetTokenCookies(HttpContext context, User user)
    {
        var accessToken = GenerateToken(user);
        var refreshToken = await GenerateRefreshToken(user.Id);

        // Cookie options for the access token
        var accessTokenOptions = new CookieOptions
        {
            HttpOnly = true, // Prevent JavaScript access
                             // Secure = true, // Only allow over HTTPS
                             // SameSite = SameSiteMode.Strict,
                             // Remove Secure for local testing if you're not using HTTPS
            SameSite = SameSiteMode.Lax, // Use Lax or None for cross-site cookies
            Expires = DateTime.UtcNow.AddMinutes(15) // Short-lived access token
        };


        // Set cookies in the response
        context.Response.Cookies.Append("AccessToken", accessToken, accessTokenOptions);
        var refreshTokenEntity = new RefreshToken
        {
            UserId = user.Id,
            Token = refreshToken,
            ExpiryDate = DateTime.UtcNow.Date,
            IsRevoked = false
        };
        await _refreshTokenRepository.AddAsync(refreshTokenEntity);
    }

    private string GenerateToken(User user)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]);
        var claims = new List<Claim> { new Claim(ClaimTypes.Name, user.Username), new Claim(ClaimTypes.NameIdentifier, user.Id) };
        foreach (var role in user.Roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role.ToString()));
        }
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddMinutes(15),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}
