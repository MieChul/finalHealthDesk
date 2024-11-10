using HealthDesk.Core;
using HealthDesk.Infrastructure;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace HealthDesk.Application.Extensions;
public static class ServiceCollectionExtensions
{

  public static IServiceCollection RegisterServices(this IServiceCollection services, IConfiguration configuration)
  {
    #region Context
    services.AddSingleton<MongoDbContext>();
    #endregion

    #region Services
    services.AddScoped<IOtpService, OtpService>();
    services.AddScoped<IMessageService, MessageService>();
    services.AddScoped<IUserService, UserService>();
    services.AddScoped<IAuthService, AuthService>();
    #endregion

    #region Repositories
    services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
    services.AddScoped<ILogRepository, LogRepository>();
    services.AddScoped<IUserRepository, UserRepository>();
    services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();
    #endregion

    return services;
  }
}
