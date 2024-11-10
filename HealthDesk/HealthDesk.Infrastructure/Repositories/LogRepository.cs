using HealthDesk.Core;

namespace HealthDesk.Infrastructure;

public class LogRepository : GenericRepository<Log>, ILogRepository
    {
        public LogRepository(MongoDbContext context) : base(context, "Logs") { }

        public async Task LogAsync(string message, string level)
        {
            var log = new Log
            {
                Message = message,
                Level = level,
                Timestamp = DateTime.UtcNow
            };
            await AddAsync(log);
        }
    }
