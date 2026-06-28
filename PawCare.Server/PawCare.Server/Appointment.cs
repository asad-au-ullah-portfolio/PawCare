namespace PawCare.Server;

public class Appointment
{
    public int Id { get; set; }
    public DateTime ScheduledAt { get; set; }
    public string Status { get; set; } = "Scheduled"; // e.g., "Scheduled", "Completed", "Cancelled"
    public string Reason { get; set; } = string.Empty; // e.g., "Vaccination", "Checkup"

    // Relationships
    public int PetId { get; set; }
    public Pet Pet { get; set; } = null!;

    public int VeterinarianId { get; set; }
    public Veterinarian Veterinarian { get; set; } = null!;
}