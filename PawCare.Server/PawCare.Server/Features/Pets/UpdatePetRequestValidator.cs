using FluentValidation;

namespace PawCare.Server.Features.Pets;

public sealed class UpdatePetRequestValidator : AbstractValidator<UpdatePetRequest>
{
    public UpdatePetRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .MaximumLength(100);

        RuleFor(x => x.Breed)
            .NotEmpty()
            .MaximumLength(100)
            .Matches(@"^[a-zA-Z\s-]+$")
            .WithMessage("Breed can only contain letters, spaces, and hyphens.");

        RuleFor(x => x.Species)
            .IsInEnum();

        RuleFor(x => x)
            .Must(x => x.DateOfBirth is not null || x.AgeInYears is not null)
            .WithMessage("Either DateOfBirth or AgeInYears must be provided.");

        RuleFor(x => x)
            .Must(x => x.DateOfBirth is null || x.AgeInYears is null)
            .WithMessage("Provide either DateOfBirth or AgeInYears, not both.");

        RuleFor(x => x.DateOfBirth)
            .LessThanOrEqualTo(DateTime.Today)
            .When(x => x.DateOfBirth is not null)
            .WithMessage("DateOfBirth cannot be in the future.");

        RuleFor(x => x.AgeInYears)
            .GreaterThanOrEqualTo(0)
            .When(x => x.AgeInYears is not null)
            .WithMessage("AgeInYears cannot be negative.");

        RuleFor(x => x.Weight)
            .GreaterThan(0)
            .When(x => x.Weight is not null)
            .WithMessage("Weight must be greater than zero.");
    }
}