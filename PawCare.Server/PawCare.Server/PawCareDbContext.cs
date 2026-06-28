using Microsoft.EntityFrameworkCore;

namespace PawCare.Server;

public class PawCareDbContext : DbContext
{
    public PawCareDbContext(DbContextOptions<PawCareDbContext> options)
        : base(options) { }

    public DbSet<Pet> Pets => Set<Pet>();
    public DbSet<PetOwner> Owners => Set<PetOwner>();
    public DbSet<Appointment> Appointments => Set<Appointment>();
    public DbSet<Veterinarian> Veterinarians => Set<Veterinarian>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Link Appointment to Pet
        modelBuilder.Entity<Appointment>()
            .HasOne(a => a.Pet)
            .WithMany()
            .HasForeignKey(a => a.PetId)
            .OnDelete(DeleteBehavior.Cascade); // If a pet is deleted, delete their appointments

        // Link Appointment to Veterinarian
        modelBuilder.Entity<Appointment>()
            .HasOne(a => a.Veterinarian)
            .WithMany(v => v.Appointments)
            .HasForeignKey(a => a.VeterinarianId)
            .OnDelete(DeleteBehavior.Restrict); // Prevent deleting a vet if they have appointments scheduled
    }
}
