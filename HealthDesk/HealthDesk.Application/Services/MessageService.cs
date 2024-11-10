using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;
using Twilio;
using Twilio.Rest.Api.V2010.Account;
using Twilio.Types;

namespace HealthDesk.Application;

 public class MessageService : IMessageService
    {
        private readonly IConfiguration _configuration;

        public MessageService(IConfiguration configuration)
        {
            _configuration = configuration;
            TwilioClient.Init(
                _configuration["Twilio:AccountSid"], 
                _configuration["Twilio:AuthToken"]
            );
        }

        // Send an SMS message using Twilio
        public void SendSms(string mobileNumber, string message)
        {
            var messageResponse = MessageResource.Create(
                to: new PhoneNumber($"+91{mobileNumber}"),
                from: new PhoneNumber(_configuration["Twilio:FromPhoneNumber"]),
                body: message
            );

            Console.WriteLine($"Sent SMS: {messageResponse.Sid}");
        }

        // Send an email message using Gmail SMTP
        public void SendEmail(string emailAddress, string subject, string body)
        {
            try
            {
                var smtpClient = new SmtpClient(_configuration["Gmail:SmtpServer"], int.Parse(_configuration["Gmail:SmtpPort"]))
                {
                    Credentials = new NetworkCredential(_configuration["Gmail:Email"], _configuration["Gmail:Password"]),
                    EnableSsl = true
                };

                var mailMessage = new MailMessage
                {
                    From = new MailAddress(_configuration["Gmail:Email"]),
                    Subject = subject,
                    Body = body,
                    IsBodyHtml = true
                };

                mailMessage.To.Add(emailAddress);
                smtpClient.Send(mailMessage);

                Console.WriteLine($"Email sent to {emailAddress} with subject: {subject}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to send email: {ex.Message}");
            }
        }
    }
