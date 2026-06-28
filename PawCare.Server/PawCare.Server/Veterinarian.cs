namespace PawCare.Server;

public class Veterinarian
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Specialty { get; set; } = string.Empty;
    public string LicenseNumber { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;

    // Relationships
    public List<Appointment> Appointments { get; set; } = new();
}
