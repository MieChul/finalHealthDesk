namespace HealthDesk.API;

public class SecurityHeadersMiddleware
    {
        private readonly RequestDelegate _next;

        public SecurityHeadersMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            // Content Security Policy (CSP) to control resources loaded by the browser
            context.Response.Headers.Add("Content-Security-Policy", "default-src 'self'; img-src 'self' data:; font-src 'self' https://fonts.gstatic.com; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; object-src 'none';");

            // X-Content-Type-Options to prevent MIME sniffing
            context.Response.Headers.Add("X-Content-Type-Options", "nosniff");

            // X-Frame-Options to prevent clickjacking
            context.Response.Headers.Add("X-Frame-Options", "DENY");

            // X-XSS-Protection to enable XSS filtering in browsers
            context.Response.Headers.Add("X-XSS-Protection", "1; mode=block");

            await _next(context);
        }
    }