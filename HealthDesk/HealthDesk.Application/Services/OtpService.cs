using System.IdentityModel.Tokens.Jwt;
using System.Runtime.InteropServices;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace HealthDesk.Application;

 public class OtpService : IOtpService
    {
        private readonly IConfiguration _configuration;
        private readonly IMessageService _messageService;
        private const int OtpLength = 6;
        private const int OtpExpiryMinutes = 5;

        public OtpService(IConfiguration configuration, IMessageService messageService)
        {
            _configuration = configuration;
            _messageService = messageService;
        }

        public string GenerateOtp()
        {
            var random = new Random();
            return random.Next(100000, 999999).ToString();
        }

        public string GenerateOtpToken(string otp, string contact)
        {
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]);
            var tokenHandler = new JwtSecurityTokenHandler();

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim("otp", otp),
                    new Claim("contact", contact),
                    new Claim("expiry", DateTime.UtcNow.AddMinutes(OtpExpiryMinutes).ToString())
                }),
                Expires = DateTime.UtcNow.AddMinutes(OtpExpiryMinutes),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public bool VerifyOtpToken(string otpToken, string enteredOtp, string contact)
        {
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]);
            var tokenHandler = new JwtSecurityTokenHandler();

            try
            {
                var principal = tokenHandler.ValidateToken(otpToken, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                var otp = principal.FindFirst("otp")?.Value;
                var tokenContact = principal.FindFirst("contact")?.Value;
                var expiry = DateTime.Parse(principal.FindFirst("expiry")?.Value);

                return otp == enteredOtp && tokenContact == contact && expiry > DateTime.UtcNow;
            }
            catch
            {
                return false;
            }
        }

        // Reusable method for sending OTP or any other message
        public void SendOtp(string contact, string otp)
        {
            var message = $"Your OTP code is {otp}. It will expire in 5 minutes.";
            SendNotification(contact, message, "Your OTP Code");
        }

        // Implementation of SendNotification for generic message sending
        public void SendNotification(string contact, string message, string subject = "HealthDesk Notification")
        {
            if (IsValidEmail(contact))
            {
                _messageService.SendEmail(contact, subject, message);
            }
            else
            {
                _messageService.SendSms(contact, message);
            }
        }

        // Method to determine if the contact is an email
        private bool IsValidEmail(string email)
        {
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == email;
            }
            catch
            {
                return false;
            }
        }
    }