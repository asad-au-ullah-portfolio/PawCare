using PawCare.Server.Enums;

namespace PawCare.Server.Features.Veterinarians;

public static class VeterinarianEndpoints
{
    public static void MapVeterinarianEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/veterinarians")
            .WithTags("Veterinarians")
            .RequireAuthorization();

        group.MapGet("/", async (VeterinarianSpecialty? specialty, IVeterinarianService vets) =>
        {
            var result = await vets.GetAllAsync(specialty);
            return Results.Ok(result);
        })
        .WithName("GetVeterinarians");

        group.MapGet("/{id:int}", async (int id, IVeterinarianService vets) =>
        {
            var vet = await vets.GetByIdAsync(id);
            return vet is not null ? Results.Ok(vet) : Results.NotFound();
        })
        .WithName("GetVeterinarianById");
    }
}