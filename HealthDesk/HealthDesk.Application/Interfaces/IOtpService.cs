namespace HealthDesk.Application;

public interface IOtpService
{
    string GenerateOtp();
    string GenerateOtpToken(string otp, string contact);
    bool VerifyOtpToken(string otpToken, string enteredOtp, string contact);
    void SendOtp(string contact, string otp);

    void SendNotification(string contact, string message, string subject = "HealthDesk Notification");
}
