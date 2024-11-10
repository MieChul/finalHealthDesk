using HealthDesk.Core;

namespace HealthDesk.API;

public class ErrorHandlingMiddleware
    {
        private readonly RequestDelegate _next;

        public ErrorHandlingMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                // Resolve ILogRepository within the request scope
                var logRepository = context.RequestServices.GetService<ILogRepository>();
                if (logRepository != null)
                {
                    await logRepository.LogAsync(ex.Message, "Error");
                }

                context.Response.StatusCode = StatusCodes.Status500InternalServerError;
                await context.Response.WriteAsync("An unexpected error occurred.");
            }
        }
    }