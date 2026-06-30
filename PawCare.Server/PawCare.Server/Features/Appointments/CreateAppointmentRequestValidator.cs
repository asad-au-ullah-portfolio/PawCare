using FluentValidation;

namespace PawCare.Server.Features.Appointments;

public sealed class CreateAppointmentRequestValidator : AbstractValidator<CreateAppointmentRequest>
{
    public CreateAppointmentRequestValidator()
    {
        RuleFor(x => x.PetId).GreaterThan(0);
        RuleFor(x => x.VeterinarianId).GreaterThan(0);

        RuleFor(x => x.ScheduledAt)
            .GreaterThan(DateTime.UtcNow)
            .WithMessage("Appointment must be scheduled in the future.");

        RuleFor(x => x.Reason).IsInEnum();

        RuleFor(x => x.DurationMinutes)
            .InclusiveBetween(15, 240)
            .WithMessage("Duration must be between 15 and 240 minutes.");
    }
}