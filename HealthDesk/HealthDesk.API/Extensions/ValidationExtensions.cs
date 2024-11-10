using FluentValidation;
using FluentValidation.AspNetCore;

namespace HealthDesk.API;

 public static class ValidationExtensions
    {
        public static IServiceCollection AddCustomValidations(this IServiceCollection services)
        {
            // Add automatic validation for models and client-side adapters
            services.AddFluentValidationAutoValidation()
                    .AddFluentValidationClientsideAdapters();

            // Register all validators in the specified assembly
            services.AddValidatorsFromAssemblyContaining<UserValidator>();
            services.AddValidatorsFromAssemblyContaining<OtpValidator>();
            return services;
        }
    }