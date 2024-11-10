using FluentValidation;
using HealthDesk.Application;

namespace HealthDesk.API;

public class OtpValidator : AbstractValidator<SendOtpRequest>
{
    public OtpValidator()
    {
        RuleFor(x => x.Contact)
            .NotEmpty().WithMessage("Either Email or Mobile number is required.")
            .DependentRules(() =>
            {
                When(x => x.IsEmail, () =>
                {
                    RuleFor(x => x.Contact)
                        .EmailAddress().WithMessage("Invalid email format.");
                });

                When(x => !x.IsEmail, () =>
                {
                    RuleFor(x => x.Contact)
                        .Matches(@"^\d{10}$").WithMessage("Mobile number must be 10 digits.");
                });
            });
    }
}