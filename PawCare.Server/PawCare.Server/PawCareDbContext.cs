using Microsoft.EntityFrameworkCore;

namespace PawCare.Server;

public class PawCareDbContext : DbContext
{
    public PawCareDbContext(DbContextOptions<PawCareDbContext> options)
        : base(options) { }

    public DbSet<Pet> Pets => Set<Pet>();
}
