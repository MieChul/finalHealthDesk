
using HealthDesk.API;
using HealthDesk.Application.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Add CORS configuration to allow specific origins
var allowedOrigins = "_allowedOrigins";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: allowedOrigins, policy =>
    {
        policy.WithOrigins("http://localhost:4200", "https://HealthDesk.com")  // Update with allowed origins
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials(); 
    });
});

builder.Services.AddControllers();
builder.Services.AddCustomValidations();


builder.Services.RegisterServices(builder.Configuration); 
// builder.Services.AddHttpsRedirection(options =>
// {
//     options.HttpsPort = 443; // Ensures HTTPS is enforced
// });
// builder.Services.Configure<ForwardedHeadersOptions>(options =>
// {
//     options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
// });

builder.Services.AddAuthentication(); 

var app = builder.Build();

app.UseHttpsRedirection();
app.UseMiddleware<ErrorHandlingMiddleware>();
app.UseMiddleware<SecurityHeadersMiddleware>();
app.UseCors(allowedOrigins);
app.UseMiddleware<TokenRefreshMiddleware>();
app.UseMiddleware<AntiMaliciousDataMiddleware>();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();