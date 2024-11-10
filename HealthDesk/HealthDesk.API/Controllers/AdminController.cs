using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HealthDesk.API.Controllers;
[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")] // Restrict access to Admins only
public class AdminController : ControllerBase
{
    public AdminController()
    {
    }
}
