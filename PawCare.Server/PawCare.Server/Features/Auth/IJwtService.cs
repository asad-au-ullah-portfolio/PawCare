using PawCare.Server.Entities;

namespace PawCare.Server.Features.Auth;

public interface IJwtService
{
    TokenResult GenerateToken(ApplicationUser user, string role);
}