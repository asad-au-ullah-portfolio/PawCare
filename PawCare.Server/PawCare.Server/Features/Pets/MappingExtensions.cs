using PawCare.Server.Entities;

namespace PawCare.Server.Features.Pets;

public static class MappingExtensions
{
    public static PetResponse ToResponse(this Pet pet) =>
        new(pet.Id, pet.Name, pet.Species, pet.Breed, pet.DateOfBirth,
            pet.IsBirthDateEstimated, pet.Weight, pet.AgeInYears);
}