using FluentValidation;
using System.Security.Claims;

namespace PawCare.Server.Features.Pets;

public static class PetEndpoints
{
    public static void MapPetEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/pets")
            .WithTags("Pets")
            .RequireAuthorization();

        group.MapGet("/", async (ClaimsPrincipal user, IPetService pets) =>
        {
            var pets_ = await pets.GetMyPetsAsync(user.GetUserId());
            return Results.Ok(pets_);
        })
        .WithName("GetMyPets");

        group.MapGet("/{id:int}", async (int id, ClaimsPrincipal user, IPetService pets) =>
        {
            var pet = await pets.GetMyPetAsync(user.GetUserId(), id);
            return pet is not null ? Results.Ok(pet) : Results.NotFound();
        })
        .WithName("GetMyPet");

        group.MapPost("/", async (CreatePetRequest request, ClaimsPrincipal user, IPetService pets, IValidator<CreatePetRequest> validator) =>
        {
            var validation = await validator.ValidateAsync(request);
            if (!validation.IsValid)
                return Results.ValidationProblem(validation.ToDictionary());

            var created = await pets.CreateAsync(user.GetUserId(), request);
            return Results.Created($"/api/pets/{created.Id}", created);
        })
        .WithName("CreatePet");

        group.MapPut("/{id:int}", async (int id, UpdatePetRequest request, ClaimsPrincipal user, IPetService pets, IValidator<UpdatePetRequest> validator) =>
        {
            var validation = await validator.ValidateAsync(request);
            if (!validation.IsValid)
                return Results.ValidationProblem(validation.ToDictionary());

            var updated = await pets.UpdateAsync(user.GetUserId(), id, request);
            return updated ? Results.NoContent() : Results.NotFound();
        })
        .WithName("UpdatePet");

        group.MapDelete("/{id:int}", async (int id, ClaimsPrincipal user, IPetService pets) =>
        {
            var deleted = await pets.DeleteAsync(user.GetUserId(), id);
            return deleted ? Results.NoContent() : Results.NotFound();
        })
        .WithName("DeletePet");
    }

    private static string GetUserId(this ClaimsPrincipal user) =>
        user.FindFirstValue(ClaimTypes.NameIdentifier)
        ?? throw new InvalidOperationException("User id claim missing.");
}