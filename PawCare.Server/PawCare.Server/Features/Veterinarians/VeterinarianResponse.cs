using PawCare.Server.Enums;

namespace PawCare.Server.Features.Veterinarians;

public sealed record VeterinarianResponse(
    int Id,
    string FirstName,
    string LastName,
    string LicenseNumber,
    VeterinarianSpecialty Specialty);