using Microsoft.EntityFrameworkCore;
using PawCare.Server.Entities;
using PawCare.Server.Persistence;

namespace PawCare.Server.Features.Pets;

public sealed class PetService(PawCareDbContext db) : IPetService
{
    public async Task<IReadOnlyList<PetResponse>> GetMyPetsAsync(string applicationUserId)
    {
        return await db.Pets
            .Where(p => p.Owner.ApplicationUserId == applicationUserId)
            .Select(p => p.ToResponse())
            .ToListAsync();
    }

    public async Task<PetResponse?> GetMyPetAsync(string applicationUserId, int petId)
    {
        var pet = await db.Pets
            .FirstOrDefaultAsync(p => p.Id == petId && p.Owner.ApplicationUserId == applicationUserId);

        return pet?.ToResponse();
    }

    public async Task<PetResponse> CreateAsync(string applicationUserId, CreatePetRequest request)
    {
        try
        {
            var owner = await db.PetOwners
                    .FirstAsync(o => o.ApplicationUserId == applicationUserId);

            var (dateOfBirth, isEstimated) = ResolveDateOfBirth(request.DateOfBirth, request.AgeInYears);

            var pet = new Pet
            {
                Name = request.Name,
                Species = request.Species,
                Breed = request.Breed,
                DateOfBirth = dateOfBirth,
                IsBirthDateEstimated = isEstimated,
                Weight = request.Weight,
                OwnerId = owner.Id,
            };

            db.Pets.Add(pet);
            await db.SaveChangesAsync();

            return pet.ToResponse();
        }
        catch (Exception)
        {

            throw;
        }
    }

    private static (DateTime DateOfBirth, bool IsEstimated) ResolveDateOfBirth(DateTime? dateOfBirth, int? ageInYears)
    {
        if (dateOfBirth is not null)
            return (DateTime.SpecifyKind(dateOfBirth.Value, DateTimeKind.Utc), false);

        if (ageInYears is not null)
            return (DateTime.SpecifyKind(DateTime.UtcNow.Date.AddYears(-ageInYears.Value), DateTimeKind.Utc), true);

        throw new ArgumentException("Either DateOfBirth or AgeInYears must be provided.");
    }

    public async Task<bool> UpdateAsync(string applicationUserId, int petId, UpdatePetRequest request)
    {
        try
        {
            var pet = await db.Pets
                .FirstOrDefaultAsync(p => p.Id == petId && p.Owner.ApplicationUserId == applicationUserId);

            if (pet is null)
                return false;

            var (dateOfBirth, isEstimated) = ResolveDateOfBirth(request.DateOfBirth, request.AgeInYears);

            pet.Name = request.Name;
            pet.Species = request.Species;
            pet.Breed = request.Breed;
            pet.DateOfBirth = dateOfBirth;
            pet.IsBirthDateEstimated = isEstimated;
            pet.Weight = request.Weight;

            await db.SaveChangesAsync();
            return true;
        }
        catch (Exception)
        {

            throw;
        }
    }

    public async Task<bool> DeleteAsync(string applicationUserId, int petId)
    {
        var pet = await db.Pets
            .FirstOrDefaultAsync(p => p.Id == petId && p.Owner.ApplicationUserId == applicationUserId);

        if (pet is null)
            return false;

        db.Pets.Remove(pet);
        await db.SaveChangesAsync();
        return true;
    }
}