using PawCare.Server.Entities;

namespace PawCare.Server.Features.Appointments;

public static class MappingExtensions
{
    public static AppointmentResponse ToResponse(this Appointment a) =>
        new(a.Id, a.ScheduledAt, a.Status, a.Reason, a.Notes, a.DurationMinutes,
            a.PetId, a.Pet.Name, a.VeterinarianId, a.Veterinarian.FirstName, a.Veterinarian.LastName);
}