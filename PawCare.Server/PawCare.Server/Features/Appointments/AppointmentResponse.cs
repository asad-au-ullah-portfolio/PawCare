using PawCare.Server.Enums;

namespace PawCare.Server.Features.Appointments;

public sealed record AppointmentResponse(
    int Id,
    DateTime ScheduledAt,
    AppointmentStatus Status,
    AppointmentReason Reason,
    string Notes,
    int DurationMinutes,
    int PetId,
    string PetName,
    int VeterinarianId,
    string VeterinarianFirstName,
    string VeterinarianLastName);