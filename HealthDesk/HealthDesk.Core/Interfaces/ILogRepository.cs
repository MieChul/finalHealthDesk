namespace HealthDesk.Core;

public interface ILogRepository : IGenericRepository<Log>
{
    Task LogAsync(string message, string level);
}
