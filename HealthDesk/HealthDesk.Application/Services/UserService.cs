using HealthDesk.Core;
using HealthDesk.Core.Enum;

namespace HealthDesk.Application;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly IRefreshTokenRepository _refreshTokenRepository;

    public UserService(IUserRepository userRepository, IRefreshTokenRepository refreshTokenRepository)
    {
        _userRepository = userRepository;
        _refreshTokenRepository = refreshTokenRepository;
    }

    public async Task<string?> GetUsernameAsync(string contact)
    {
        var isEmail = new System.Net.Mail.MailAddress(contact)?.Address == contact;
        var user = await _userRepository.GetByEmailOrMobileAsync(contact, isEmail);

        return user?.Username;
    }


    public async Task<bool> IsTaken(string name, string value)
    {
        var found = await _userRepository.GetByDynamicPropertyAsync(name, value);
        return found != null;
    }


    public async Task<string> Register(UserRegistrationDto userDto)
    {

        var user = new User();
        GenericMapper.Map<UserRegistrationDto, User>(userDto, user);
         user.Roles = new List<Role> { (Role)userDto.RoleId};
        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(userDto.Password);
        await _userRepository.AddAsync(user);
        return "User registered successfully";
    }

    public async Task<bool> ResetPasswordAsync(string contact, string newPassword, bool isEmail = false)
    {
        var user = await _userRepository.GetByEmailOrMobileAsync(contact, isEmail);
        if (user == null) return false;

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
        await _userRepository.UpdateAsync(user);
        return true;
    }
}
