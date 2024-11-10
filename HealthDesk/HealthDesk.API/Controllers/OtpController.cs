using HealthDesk.Application;
using Microsoft.AspNetCore.Mvc;

namespace HealthDesk.API.Controllers;
[ApiController]
[Route("api/[controller]")]
public class OtpController : ControllerBase
{
    private readonly IOtpService _otpService;

    public OtpController(IOtpService otpService)
    {
        _otpService = otpService;
    }

    [HttpPost("send")]
    public IActionResult SendOtp([FromBody] SendOtpRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        var otp = _otpService.GenerateOtp();
        var otpToken = _otpService.GenerateOtpToken(otp, request.Contact);

        // Send OTP via messaging service
        _otpService.SendNotification(request.Contact, $"Your OTP is {otp}. It will expire in 5 minutes.", "Your OTP Code");

        return Ok(new { OtpToken = otpToken });
    }

    [HttpPost("verify")]
    public IActionResult VerifyOtp([FromBody] VerifyOtpRequest request)
    {
        var isValid = _otpService.VerifyOtpToken(request.OtpToken, request.Otp, request.Contact);
        if (isValid)
        {
            return Ok(new { Message = "OTP verified successfully", Valid = true });
        }
        return Unauthorized("Invalid or expired OTP.");
    }
}