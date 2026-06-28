using PawCare.Server.Enums;

namespace PawCare.Server.Entities;

public class Veterinarian
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public VeterinarianSpecialty Specialty { get; set; }
    public string LicenseNumber { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// Relationships
    /// </summary>
    public List<Appointment> Appointments { get; set; } = new();
}
