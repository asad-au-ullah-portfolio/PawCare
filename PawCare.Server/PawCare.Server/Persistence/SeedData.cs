using PawCare.Server.Entities;
using PawCare.Server.Enums;

namespace PawCare.Server.Persistence;

public static class SeedData
{
    public static (ApplicationUser[] Users, Veterinarian[] Vets) Build()
    {
        var raw = new[]
        {
            new { VetId = 1, UserId = "vet-seed-0001", First = "Sarah",  Last = "Mitchell",  License = "VET-0001", Specialty = VeterinarianSpecialty.GeneralPractice, Years = 8,  Fee = 50.00m,  Hash = "AQAAAAIAAYagAAAAEJCZc3vwf1fiRepOISIEe1oZtgbyM7WaskhzadRRo198RUfp1jwiQmMPPd7ykWIOhA==" },
            new { VetId = 2, UserId = "vet-seed-0002", First = "Daniel", Last = "Okafor",    License = "VET-0002", Specialty = VeterinarianSpecialty.Surgery,         Years = 12, Fee = 120.00m, Hash = "AQAAAAIAAYagAAAAEGPeMNESI1AyHiEnxFcZgGJuAXVJyQ5vDemZQg1zZKW78BWHI1SbNUnWvwYmqM+sgw==" },
            new { VetId = 3, UserId = "vet-seed-0003", First = "Priya",  Last = "Nair",      License = "VET-0003", Specialty = VeterinarianSpecialty.Dermatology,     Years = 6,  Fee = 65.00m,  Hash = "AQAAAAIAAYagAAAAEIy2tffpV/UNTeU5IIryMPdrgWBprd1bXbEAIjWMJMv+NcJlsi9KWxpfnz1Cse3YsQ==" },
            new { VetId = 4, UserId = "vet-seed-0004", First = "James",  Last = "Whitfield", License = "VET-0004", Specialty = VeterinarianSpecialty.Cardiology,      Years = 15, Fee = 150.00m, Hash = "AQAAAAIAAYagAAAAEPG5tvVWZ35M5290SdZJWmepJmiD4cn8nr39wEBooj6wOteeaVkiBaR1O3UFIPavIA==" },
            new { VetId = 5, UserId = "vet-seed-0005", First = "Elena",  Last = "Vasquez",   License = "VET-0005", Specialty = VeterinarianSpecialty.ExoticAnimals,   Years = 9,  Fee = 90.00m,  Hash = "AQAAAAIAAYagAAAAEG0FQR/Zn2C/Xw503lmL+QxN26Gpb9ekt66lOSARPkKjKV/AmJmn6zfYCGcGSbxWDQ==" },
        };

        var users = new List<ApplicationUser>();
        var vets = new List<Veterinarian>();

        foreach (var r in raw)
        {
            var email = $"{r.First.ToLowerInvariant()}.{r.Last.ToLowerInvariant()}@pawcare-vet.test";

            users.Add(new ApplicationUser
            {
                Id = r.UserId,
                UserName = email,
                NormalizedUserName = email.ToUpperInvariant(),
                Email = email,
                NormalizedEmail = email.ToUpperInvariant(),
                EmailConfirmed = true,
                SecurityStamp = r.UserId,
                ConcurrencyStamp = r.UserId,
                PasswordHash = r.Hash,
            });

            vets.Add(new Veterinarian
            {
                Id = r.VetId,
                FirstName = r.First,
                LastName = r.Last,
                LicenseNumber = r.License,
                Specialty = r.Specialty,
                YearsOfExperience = r.Years,
                ConsultationFee = r.Fee,
                ApplicationUserId = r.UserId,
            });
        }

        return (users.ToArray(), vets.ToArray());
    }
}