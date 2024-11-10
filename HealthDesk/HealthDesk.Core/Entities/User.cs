using HealthDesk.Core.Enum;

namespace HealthDesk.Core;

    public class User : BaseEntity
    {
    public string Username { get; set; }
    public string PasswordHash { get; set; }
    public string Email { get; set; }
    public string Mobile { get; set; }
    public List<Role> Roles { get; set; } = new List<Role>();
    }
