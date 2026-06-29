using PawCare.Server.Entities;
using PawCare.Server.Enums;

public class Veterinarian
{
    public int Id { get; set; }

    public string FirstName { get; set; } = string.Empty;

    public string LastName { get; set; } = string.Empty;

    public string LicenseNumber { get; set; } = string.Empty;

    public VeterinarianSpecialty Specialty { get; set; }

    public string ApplicationUserId { get; set; } = string.Empty;

    public ApplicationUser ApplicationUser { get; set; } = null!;

    public ICollection<Appointment> Appointments { get; set; } = [];
}