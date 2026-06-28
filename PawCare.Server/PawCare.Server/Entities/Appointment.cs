using PawCare.Server.Enums;

namespace PawCare.Server.Entities;

public class Appointment
{
    public int Id { get; set; }
    public DateTime ScheduledAt { get; set; }
    public AppointmentStatus Status { get; set; } = AppointmentStatus.Scheduled;
    public AppointmentReason Reason { get; set; } = AppointmentReason.Checkup;
    /// <summary>
    /// Clinical notes recorded after the appointment
    /// </summary>
    public string Notes { get; set; } = string.Empty;
    /// <summary>
    /// Length of the appointment slot
    /// </summary>
    public int DurationMinutes { get; set; } = 30;

    /// <summary>
    /// Relationships
    /// </summary>
    public int PetId { get; set; }
    public Pet Pet { get; set; } = null!;

    public int VeterinarianId { get; set; }
    public Veterinarian Veterinarian { get; set; } = null!;
}