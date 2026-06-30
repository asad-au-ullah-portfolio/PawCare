using PawCare.Server.Enums;

namespace PawCare.Server.Features.Pets;

public sealed record CreatePetRequest(
    string Name,
    PetSpecies Species,
    string Breed,
    DateTime? DateOfBirth,
    int? AgeInYears,
    double? Weight);