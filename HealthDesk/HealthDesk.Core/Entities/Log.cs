namespace HealthDesk.Core;

 public class Log : BaseEntity
    {
        public string Message { get; set; }
        public string Level { get; set; }
        public DateTime Timestamp { get; set; }
    }
