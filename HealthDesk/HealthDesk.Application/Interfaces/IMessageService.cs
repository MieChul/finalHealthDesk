namespace HealthDesk.Application;

public interface IMessageService
    {
        void SendSms(string mobileNumber, string message);
        void SendEmail(string emailAddress, string subject, string body);
    }