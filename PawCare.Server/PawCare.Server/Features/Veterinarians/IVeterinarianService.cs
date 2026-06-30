using PawCare.Server.Enums;

namespace PawCare.Server.Features.Veterinarians;

public interface IVeterinarianService
{
    Task<IReadOnlyList<VeterinarianResponse>> GetAllAsync(VeterinarianSpecialty? specialty);
    Task<VeterinarianResponse?> GetByIdAsync(int id);
}