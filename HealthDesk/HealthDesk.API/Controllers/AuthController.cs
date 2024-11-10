using HealthDesk.Application;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HealthDesk.API.Controllers;
[Route("[controller]")]
public class AuthController : Controller
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] UserLoginDto loginDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var user = await _authService.Authenticate(loginDto.Username, loginDto.Password);
        if (user == null)
        {
            return Unauthorized("Invalid credentials.");
        }

        // Set the access token in an HttpOnly cookie
        await _authService.SetTokenCookies(HttpContext, user);

        // Return the user's role or any additional info, but not the token itself
        return Ok(new { Role = user.Roles.FirstOrDefault()});
    }

    [HttpPost("logout")]
    public IActionResult Logout()
    {
        // Remove the authentication cookie
        Response.Cookies.Delete("AccessToken");
        Response.Cookies.Delete("RefreshToken");
        return Ok(new { message = "Logged out successfully" });
    }
}