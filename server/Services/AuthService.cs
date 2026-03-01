using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using TikintiApi.DTOs;
using TikintiApi.Entities;
using TikintiApi.Repositories.Interfaces;

namespace TikintiApi.Services;

public class AuthService(IAdminUserRepository repo, IOptions<JwtSettings> jwtOptions)
{
    private readonly JwtSettings _jwt = jwtOptions.Value;

    public async Task<LoginResponse?> LoginAsync(LoginRequest request)
    {
        var user = await repo.GetByUsernameAsync(request.Username);

        if (user is null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            return null;

        var expiry = DateTime.UtcNow.AddHours(_jwt.ExpiryHours);
        return new LoginResponse(GenerateToken(user.Username, expiry), expiry, user.Username);
    }

    private string GenerateToken(string username, DateTime expiry)
    {
        var key   = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwt.Secret));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var token = new JwtSecurityToken(
            issuer: _jwt.Issuer,
            audience: _jwt.Audience,
            claims: [new Claim(ClaimTypes.Name, username)],
            expires: expiry,
            signingCredentials: creds);
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
