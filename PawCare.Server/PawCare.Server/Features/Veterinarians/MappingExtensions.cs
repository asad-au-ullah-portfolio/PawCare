using PawCare.Server.Entities;

namespace PawCare.Server.Features.Veterinarians;

public static class MappingExtensions
{
    public static VeterinarianResponse ToResponse(this Veterinarian vet) =>
        new(vet.Id, vet.FirstName, vet.LastName, vet.LicenseNumber, vet.Specialty);
}