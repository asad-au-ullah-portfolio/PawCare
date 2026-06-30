using PawCare.Server.Enums;

namespace PawCare.Server.Features.Appointments;

public sealed record CreateAppointmentRequest(
    int PetId,
    int VeterinarianId,
    DateTime ScheduledAt,
    AppointmentReason Reason,
    int DurationMinutes);