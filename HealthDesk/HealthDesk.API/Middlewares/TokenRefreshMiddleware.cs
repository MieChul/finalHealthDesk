using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using HealthDesk.Application;
using Microsoft.IdentityModel.Tokens;

namespace HealthDesk.API;

public class TokenRefreshMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IConfiguration _configuration;

    public TokenRefreshMiddleware(RequestDelegate next, IConfiguration configuration)
    {
        _next = next;
        _configuration = configuration;
    }

    public async Task InvokeAsync(HttpContext context, IServiceProvider serviceProvider)
    {
        var accessToken = context.Request.Cookies["AccessToken"];
        var tokenHandler = new JwtSecurityTokenHandler();


        if (!string.IsNullOrEmpty(accessToken))
        {
            try
            {
                // Validate the access token to check for expiration
                tokenHandler.ValidateToken(accessToken, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_configuration["Jwt:Key"])),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                // Token is valid, proceed with the next middleware
                await _next(context);
                return;
            }
            catch (SecurityTokenExpiredException)
            {
                // Access token is expired, proceed to refresh it
                var jwtToken = tokenHandler.ReadToken(accessToken) as JwtSecurityToken;
                var userId = jwtToken?.Claims.FirstOrDefault(claim => claim.Type == ClaimTypes.NameIdentifier)?.Value;

                if (userId == null)
                {
                    // No valid user ID found, unauthorized request
                    context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    await context.Response.WriteAsync("Unauthorized: User ID missing in expired token.");
                    return; ;
                }
                var newAccessToken = string.Empty;
                using (var scope = serviceProvider.CreateScope())
                {
                    var _authService = scope.ServiceProvider.GetRequiredService<IAuthService>();
                    newAccessToken = await _authService.RefreshAccessToken(userId);
                }

                if (!string.IsNullOrEmpty(newAccessToken))
                {
                    // Set the new access token as an HttpOnly cookie
                    context.Response.Cookies.Append("AccessToken", newAccessToken, new CookieOptions
                    {
                        HttpOnly = true,
                        Secure = true, // Only allow over HTTPS in production
                        SameSite = SameSiteMode.Strict,
                        Expires = DateTime.UtcNow.AddMinutes(15)
                    });
                }
                else
                {

                    // Unable to refresh access token, send unauthorized response
                    context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    await context.Response.WriteAsync("Unauthorized: Refresh token is invalid or expired.");
                    return;
                }
            }
        }

        // Continue with the request
        await _next(context);
    }
}
