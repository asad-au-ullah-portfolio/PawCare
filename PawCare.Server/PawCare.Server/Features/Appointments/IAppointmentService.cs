namespace PawCare.Server.Features.Appointments;

public interface IAppointmentService
{
    Task<AppointmentResult> CreateAsync(string applicationUserId, CreateAppointmentRequest request);
    Task<IReadOnlyList<AppointmentResponse>> GetMyAppointmentsAsync(string applicationUserId);
}

public sealed record AppointmentResult(bool Succeeded, AppointmentResponse? Appointment, string? Error);