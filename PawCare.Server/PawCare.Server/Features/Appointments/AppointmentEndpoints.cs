using System.Security.Claims;
using FluentValidation;

namespace PawCare.Server.Features.Appointments;

public static class AppointmentEndpoints
{
    public static void MapAppointmentEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/appointments")
            .WithTags("Appointments")
            .RequireAuthorization();

        group.MapPost("/", async (
            CreateAppointmentRequest request,
            ClaimsPrincipal user,
            IAppointmentService appointments,
            IValidator<CreateAppointmentRequest> validator) =>
        {
            var validation = await validator.ValidateAsync(request);
            if (!validation.IsValid)
                return Results.ValidationProblem(validation.ToDictionary());

            var result = await appointments.CreateAsync(user.GetUserId(), request);

            return result.Succeeded
                ? Results.Created($"/api/appointments/{result.Appointment!.Id}", result.Appointment)
                : Results.BadRequest(new { result.Error });
        })
        .WithName("CreateAppointment");

        group.MapGet("/me", async (ClaimsPrincipal user, IAppointmentService appointments) =>
        {
            var result = await appointments.GetMyAppointmentsAsync(user.GetUserId());
            return Results.Ok(result);
        })
        .WithName("GetMyAppointments");
    }

    private static string GetUserId(this ClaimsPrincipal user) =>
        user.FindFirstValue(ClaimTypes.NameIdentifier)
        ?? throw new InvalidOperationException("User id claim missing.");
}