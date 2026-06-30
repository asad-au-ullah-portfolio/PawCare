using Microsoft.EntityFrameworkCore;
using PawCare.Server.Entities;
using PawCare.Server.Enums;
using PawCare.Server.Persistence;

namespace PawCare.Server.Features.Appointments;

public sealed class AppointmentService(PawCareDbContext db) : IAppointmentService
{
    public async Task<AppointmentResult> CreateAsync(string applicationUserId, CreateAppointmentRequest request)
    {
        var pet = await db.Pets
            .FirstOrDefaultAsync(p => p.Id == request.PetId && p.Owner.ApplicationUserId == applicationUserId);

        if (pet is null)
            return Fail("Pet not found or does not belong to you.");

        var vetExists = await db.Veterinarians.AnyAsync(v => v.Id == request.VeterinarianId);
        if (!vetExists)
            return Fail("Veterinarian not found.");

        var newStart = request.ScheduledAt;
        var newEnd = newStart.AddMinutes(request.DurationMinutes);

        var hasConflict = await db.Appointments
            .Where(a => a.VeterinarianId == request.VeterinarianId
                     && a.Status != AppointmentStatus.Cancelled
                     && a.Status != AppointmentStatus.NoShow)
            .AnyAsync(a => newStart < a.ScheduledAt.AddMinutes(a.DurationMinutes) && a.ScheduledAt < newEnd);

        if (hasConflict)
            return Fail("This veterinarian is not available at the requested time.");

        var appointment = new Appointment
        {
            PetId = pet.Id,
            VeterinarianId = request.VeterinarianId,
            ScheduledAt = DateTime.SpecifyKind(request.ScheduledAt, DateTimeKind.Utc),
            Reason = request.Reason,
            DurationMinutes = request.DurationMinutes,
            Status = AppointmentStatus.Scheduled,
        };

        db.Appointments.Add(appointment);
        await db.SaveChangesAsync();

        await db.Entry(appointment).Reference(a => a.Pet).LoadAsync();
        await db.Entry(appointment).Reference(a => a.Veterinarian).LoadAsync();

        return new AppointmentResult(true, appointment.ToResponse(), null);
    }

    public async Task<IReadOnlyList<AppointmentResponse>> GetMyAppointmentsAsync(string applicationUserId)
    {
        return await db.Appointments
            .Where(a => a.Pet.Owner.ApplicationUserId == applicationUserId)
            .Include(a => a.Pet)
            .Include(a => a.Veterinarian)
            .OrderBy(a => a.ScheduledAt)
            .Select(a => a.ToResponse())
            .ToListAsync();
    }

    private static AppointmentResult Fail(string error) => new(false, null, error);
}