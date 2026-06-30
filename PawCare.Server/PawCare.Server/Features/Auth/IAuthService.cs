namespace PawCare.Server.Features.Auth;

public interface IAuthService
{
    Task<AuthResult> RegisterAsync(RegisterRequest request);
    Task<AuthResult> LoginAsync(LoginRequest request);
}

public sealed record AuthResult(bool Succeeded, string? Token, DateTime? ExpiresAt, string? Role, string? Error);