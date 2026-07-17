using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PawCare.Server.Entities;
using PawCare.Server.Persistence;

namespace PawCare.Server.Features.Auth;

public sealed class AuthService(
    UserManager<ApplicationUser> userManager,
    IJwtService jwtService,
    PawCareDbContext db) : IAuthService
{ 
    public async Task<AuthResult> RegisterAsync(RegisterRequest request)
    {
        if (await userManager.FindByEmailAsync(request.Email) is not null)
            return Fail("Email is already registered.");

        var user = new ApplicationUser
        {
            UserName = request.Email,
            Email = request.Email,
        };

        var createResult = await userManager.CreateAsync(user, request.Password);
        if (!createResult.Succeeded)
            return Fail(createResult.Errors.First().Description);

        var roleResult = await userManager.AddToRoleAsync(user, Roles.PetOwner);
        if (!roleResult.Succeeded)
        {
            await userManager.DeleteAsync(user);
            return Fail(roleResult.Errors.First().Description);
        }

        try
        {
            db.PetOwners.Add(new PetOwner
            {
                ApplicationUserId = user.Id,
                FirstName = request.FirstName,
                LastName = request.LastName,
            });

            await db.SaveChangesAsync();
        }
        catch
        {
            await userManager.DeleteAsync(user);
            throw;
        }

        var token = jwtService.GenerateToken(user, Roles.PetOwner);
        return Ok(token);
    }

    public async Task<AuthResult> LoginAsync(LoginRequest request)
    {
        var user = await db.Users
                    .Include(x => x.PetOwner)
                    .Include(x => x.Veterinarian)
                    .SingleOrDefaultAsync(x => x.Email == request.Email);

        if (user is null ||
            !await userManager.CheckPasswordAsync(user, request.Password))
        {
            return Fail("Invalid email or password.");
        }

        var roles = await userManager.GetRolesAsync(user);
        var role = roles.FirstOrDefault() ?? Roles.PetOwner;

        return Ok(jwtService.GenerateToken(user, role));
    }

    private static AuthResult Ok(TokenResult t) => new(true, t.Token, t.ExpiresAt, t.Role, null);
    private static AuthResult Fail(string error) => new(false, null, null, null, error);
}