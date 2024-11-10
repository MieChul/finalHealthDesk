using HealthDesk.Core;

namespace HealthDesk.Application;

 public interface IUserService
    {
        Task<string> Register(UserRegistrationDto user);
        Task<bool> ResetPasswordAsync(string contact, string newPassword, bool isEmail = false);
        Task<string?> GetUsernameAsync(string contact);
        Task<bool> IsTaken(string name, string value);
    }
