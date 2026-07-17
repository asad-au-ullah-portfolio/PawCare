using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using PawCare.Server.Entities;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace PawCare.Server.Features.Auth;

public sealed class JwtService(IOptions<JwtOptions> options) : IJwtService
{
    private readonly JwtOptions _options = options.Value;

    public TokenResult GenerateToken(ApplicationUser user, string role)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_options.Key));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expiresAt = DateTime.UtcNow.AddMinutes(_options.ExpiryMinutes);

        var FirstName = user.PetOwner?.FirstName ?? user.Veterinarian?.FirstName;
        var LastName = user.PetOwner?.LastName ?? user.Veterinarian?.LastName;

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub,   user.Id),
            new Claim(JwtRegisteredClaimNames.Email, user.Email!),
            new Claim(JwtRegisteredClaimNames.GivenName, FirstName ?? string.Empty),
            new Claim(JwtRegisteredClaimNames.FamilyName, LastName ?? string.Empty),
            new Claim(JwtRegisteredClaimNames.Jti,   Guid.NewGuid().ToString()),
            new Claim(ClaimTypes.Role,               role),
        };

        var token = new JwtSecurityToken(
            issuer: _options.Issuer,
            audience: _options.Audience,
            claims: claims,
            expires: expiresAt,
            signingCredentials: credentials);

        return new TokenResult(new JwtSecurityTokenHandler().WriteToken(token), expiresAt, role);
    }
}

public sealed record TokenResult(string Token, DateTime ExpiresAt, string Role);