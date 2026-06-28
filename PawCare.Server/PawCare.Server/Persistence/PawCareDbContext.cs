using Microsoft.EntityFrameworkCore;
using PawCare.Server.Entities;

namespace PawCare.Server.Persistence;

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

        // Link Pet to PetOwner
        modelBuilder.Entity<Pet>()
            .HasOne(p => p.Owner)
            .WithMany(o => o.Pets)
            .HasForeignKey(p => p.OwnerId)
            .OnDelete(DeleteBehavior.Cascade); // If an owner is deleted, delete their pets (and by cascade, their appointments)

        // Link Appointment to Pet
        modelBuilder.Entity<Appointment>()
            .HasOne(a => a.Pet)
            .WithMany(p => p.Appointments)
            .HasForeignKey(a => a.PetId)
            .OnDelete(DeleteBehavior.Cascade); // If a pet is deleted, delete their appointments

        // Link Appointment to Veterinarian
        modelBuilder.Entity<Appointment>()
            .HasOne(a => a.Veterinarian)
            .WithMany(v => v.Appointments)
            .HasForeignKey(a => a.VeterinarianId)
            .OnDelete(DeleteBehavior.Restrict); // Prevent deleting a vet if they have appointments scheduled

        modelBuilder.Entity<Veterinarian>()
            .Property(v => v.Specialty)
            .HasConversion<string>(); // Stores enum values as readable strings in the DB

        modelBuilder.Entity<Appointment>()
            .Property(a => a.Status)
            .HasConversion<string>();

        modelBuilder.Entity<Appointment>()
            .Property(a => a.Reason)
            .HasConversion<string>();

        modelBuilder.Entity<Pet>()
            .Property(p => p.Species)
            .HasConversion<string>();
    }
}