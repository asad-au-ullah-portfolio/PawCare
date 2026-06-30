using PawCare.Server.Enums;

namespace PawCare.Server.Features.Pets;

public sealed record UpdatePetRequest(
    string Name,
    PetSpecies Species,
    string Breed,
    DateTime? DateOfBirth,
    int? AgeInYears,
    double? Weight);