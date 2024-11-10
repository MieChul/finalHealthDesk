using FluentValidation;
using HealthDesk.Application;
using HealthDesk.Core.Enum;

namespace HealthDesk.API;

public class UserValidator : AbstractValidator<UserRegistrationDto>
{
    public UserValidator()
    {
        RuleFor(x => x.Username)
            .NotEmpty().WithMessage("Username is required")
            .Length(3, 50).WithMessage("Username must be between 3 and 50 characters");

        RuleFor(x => x.Email)
            .EmailAddress().WithMessage("Invalid email format")
            .When(x => !string.IsNullOrEmpty(x.Email));

        RuleFor(x => x.Mobile)
            .Matches(@"^\d{10}$").WithMessage("Mobile number must be 10 digits")
            .When(x => !string.IsNullOrEmpty(x.Mobile));

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password is required")
            .MinimumLength(6).WithMessage("Password must be at least 6 characters long");

        RuleFor(x => x.RoleId)
            .NotEmpty().WithMessage("Role is required")
            .Must(roleId => Enum.IsDefined(typeof(Role), roleId))
            .WithMessage("Invalid role");

        RuleFor(x => x)
            .Must(x => !string.IsNullOrEmpty(x.Email) || !string.IsNullOrEmpty(x.Mobile))
            .WithMessage("Either Mobile or Email is required");
    }
}
