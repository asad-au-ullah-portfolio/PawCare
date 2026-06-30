using PawCare.Server.Enums;

namespace PawCare.Server.Features.Pets;

public sealed record PetResponse(
    int Id,
    string Name,
    PetSpecies Species,
    string Breed,
    DateTime DateOfBirth,
    bool IsBirthDateEstimated,
    double? Weight,
    int AgeInYears);