using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using PawCare.Server.Entities;

namespace PawCare.Server.Persistence;

// Inheriting from IdentityDbContext pulls in all user, role, and claim tracking tables
public class PawCareDbContext : IdentityDbContext<ApplicationUser>
{
    public PawCareDbContext(DbContextOptions<PawCareDbContext> options)
        : base(options) { }

    public DbSet<Pet> Pets => Set<Pet>();
    public DbSet<PetOwner> PetOwners => Set<PetOwner>();
    public DbSet<Appointment> Appointments => Set<Appointment>();
    public DbSet<Veterinarian> Veterinarians => Set<Veterinarian>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Identity relationships

        modelBuilder.Entity<PetOwner>()
            .HasOne(p => p.ApplicationUser)
            .WithOne(u => u.PetOwner)
            .HasForeignKey<PetOwner>(p => p.ApplicationUserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Veterinarian>()
            .HasOne(v => v.ApplicationUser)
            .WithOne(u => u.Veterinarian)
            .HasForeignKey<Veterinarian>(v => v.ApplicationUserId)
            .OnDelete(DeleteBehavior.Cascade);

        // Domain relationships

        modelBuilder.Entity<Pet>()
            .HasOne(p => p.Owner)
            .WithMany(o => o.Pets)
            .HasForeignKey(p => p.OwnerId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Appointment>()
            .HasOne(a => a.Pet)
            .WithMany(p => p.Appointments)
            .HasForeignKey(a => a.PetId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Appointment>()
            .HasOne(a => a.Veterinarian)
            .WithMany(v => v.Appointments)
            .HasForeignKey(a => a.VeterinarianId)
            .OnDelete(DeleteBehavior.Restrict);

        // Enum conversions

        modelBuilder.Entity<Veterinarian>()
            .Property(v => v.Specialty)
            .HasConversion<string>();

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