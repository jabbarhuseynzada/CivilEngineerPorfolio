using Microsoft.AspNetCore.Mvc;
using TikintiApi.DTOs;
using TikintiApi.Services;

namespace TikintiApi.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(AuthService authService) : ControllerBase
{
    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login(LoginRequest request)
    {
        var result = await authService.LoginAsync(request);
        if (result is null)
            return Unauthorized(new { message = "İstifadəçi adı və ya şifrə yanlışdır." });
        return Ok(result);
    }
}
