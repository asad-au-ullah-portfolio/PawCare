namespace PawCare.Server.Features.Auth;

public static class AuthEndpoints
{
    public static void MapAuthEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/auth").WithTags("Auth");

        group.MapPost("/register", async (RegisterRequest request, IAuthService auth) =>
        {
            var result = await auth.RegisterAsync(request);

            return result.Succeeded
                ? Results.Created(string.Empty, new { result.Token, result.ExpiresAt, result.Role })
                : Results.BadRequest(new { result.Error });
        })
        .WithName("Register")
        .AllowAnonymous();

        group.MapPost("/login", async (LoginRequest request, IAuthService auth) =>
        {
            var result = await auth.LoginAsync(request);

            return result.Succeeded
                ? Results.Ok(new { result.Token, result.ExpiresAt, result.Role })
                : Results.Unauthorized();
        })
        .WithName("Login")
        .AllowAnonymous();
    }
}