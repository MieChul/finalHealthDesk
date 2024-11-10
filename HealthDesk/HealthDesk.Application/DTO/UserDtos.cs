using System.ComponentModel.DataAnnotations;

namespace HealthDesk.Application;

public class PasswordResetDto
{
    public string Contact { get; set; }
    public string NewPassword { get; set; }
    public bool IsEmail { get; set; }
}

public class UserLoginDto
{
    [Required]
    public string Username { get; set; }

    [Required]
    public string Password { get; set; }
}

public class UserRegistrationDto
{
      public string Username { get; set; }
    public string Password { get; set; }
    public string? Email { get; set; } = string.Empty;
    public string Mobile { get; set; }
    public int RoleId{ get; set; } 
}