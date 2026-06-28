using PawCare.Server.Enums;

namespace PawCare.Server.Entities;

public class Pet
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public PetSpecies Species { get; set; }

    public string Breed { get; set; } = string.Empty;
    public DateTime DateOfBirth { get; set; }
    public bool IsBirthDateEstimated { get; set; }
    public double? Weight { get; set; }

    /// <summary>
    /// Navigation property: One owner can have many pets
    /// </summary>
    public int OwnerId { get; set; }
    public PetOwner Owner { get; set; } = null!;

    /// <summary>
    /// Navigation property: One pet can have many appointments
    /// </summary>
    public List<Appointment> Appointments { get; set; } = new();

    /// <summary>
    /// Computed property: Automatically calculates age based on current date
    /// </summary>
    public int AgeInYears
    {
        get
        {
            var today = DateTime.Today;
            var age = today.Year - DateOfBirth.Year;

            // Go back one year if the pet hasn't hit its birthday month/day yet this year
            if (DateOfBirth.Date > today.AddYears(-age)) age--;

            return age;
        }
    }
}