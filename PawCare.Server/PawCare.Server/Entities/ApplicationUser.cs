using Microsoft.AspNetCore.Identity;

namespace PawCare.Server.Entities;

public class ApplicationUser : IdentityUser
{
    public PetOwner? PetOwner { get; set; }

    public Veterinarian? Veterinarian { get; set; }
}