using Microsoft.EntityFrameworkCore;
using PawCare.Server.Enums;
using PawCare.Server.Persistence;

namespace PawCare.Server.Features.Veterinarians;

public sealed class VeterinarianService(PawCareDbContext db) : IVeterinarianService
{
    public async Task<IReadOnlyList<VeterinarianResponse>> GetAllAsync(VeterinarianSpecialty? specialty)
    {
        var query = db.Veterinarians.AsQueryable();

        if (specialty is not null)
            query = query.Where(v => v.Specialty == specialty);

        return await query
            .Select(v => v.ToResponse())
            .ToListAsync();
    }

    public async Task<VeterinarianResponse?> GetByIdAsync(int id)
    {
        var vet = await db.Veterinarians.FirstOrDefaultAsync(v => v.Id == id);
        return vet?.ToResponse();
    }
}