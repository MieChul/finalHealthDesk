namespace HealthDesk.Application;

public class SendOtpRequest
    {
        public string Contact { get; set; }
        public bool IsEmail { get; set; } = false;
    }

    public class VerifyOtpRequest
    {
        public string Contact { get; set; } 
        public string Otp { get; set; }
        public string OtpToken { get; set; }
    }