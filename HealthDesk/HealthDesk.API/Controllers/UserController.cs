using HealthDesk.Application;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HealthDesk.API.Controllers;
[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;
    public UserController(IUserService userService)
    {
        _userService = userService;
    }

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] UserRegistrationDto user)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest("Validation failed. Please correct the errors and try again");

        }

        if (await _userService.IsTaken("username", user.Username))
        {
            return BadRequest("Username is already taken.");
        }

        if (!string.IsNullOrEmpty(user.Email) && await _userService.IsTaken("email", user.Email))
        {
            return BadRequest("Email is already registered");
        }

        if (!string.IsNullOrEmpty(user.Mobile) && await _userService.IsTaken("mobile", user.Mobile))
        {
            return BadRequest("Mobile number is already registered");
        }

        var result = await _userService.Register(user);
        return Ok(new { Message = result });
    }

    [AllowAnonymous]
    [HttpPost("get-username")]
    public async Task<IActionResult> GetUsername([FromBody] string contact)
    {
        var result = await _userService.GetUsernameAsync(contact);
        if (string.IsNullOrEmpty(result)) return NotFound("User not found.");

        return Ok(new { Username = result });
    }

    [AllowAnonymous]
    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] PasswordResetDto resetDto)
    {
        var result = await _userService.ResetPasswordAsync(resetDto.Contact, resetDto.NewPassword, resetDto.IsEmail);
        if (!result) return NotFound("User not found.");

        return Ok(new { message = "Password successfully reset!" });
    }
}
