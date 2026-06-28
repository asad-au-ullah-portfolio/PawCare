namespace PawCare.Server.Entities;

public class Appointment
{
    public int Id { get; set; }
    public DateTime ScheduledAt { get; set; }
    public string Status { get; set; } = "Scheduled"; // e.g., "Scheduled", "Completed", "Cancelled"
    public string Reason { get; set; } = string.Empty; // e.g., "Vaccination", "Checkup"
    public string Notes { get; set; } = string.Empty; // Clinical notes recorded after the appointment
    public int DurationMinutes { get; set; } = 30; // Length of the appointment slot

    /// <summary>
    /// Relationships
    /// </summary>
    public int PetId { get; set; }
    public Pet Pet { get; set; } = null!;

    public int VeterinarianId { get; set; }
    public Veterinarian Veterinarian { get; set; } = null!;
}