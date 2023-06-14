using Microsoft.EntityFrameworkCore;
using RRH_Minigames_API.Identity;

namespace RRH_Minigames_API;

public sealed class  DataContext : DbContext
{
    private readonly string _dbPath;

    public DataContext()
    {
        var rootDir = Directory.GetCurrentDirectory();
        var databaseName = Path.Combine(rootDir, "Data/db.sqlite3");
        _dbPath = databaseName;
    }
    public required DbSet<PlayerStat> Stats { get; init; }
    public required DbSet<DbUser> Users { get; init; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        modelBuilder.Entity<DbUser>().ToTable("Users");
        modelBuilder.Entity<DbUser>().HasKey(u => u.GUID);
        modelBuilder.Entity<DbUser>().HasMany(s => s.Stats)
            .WithOne(mi => mi.User)
            .HasForeignKey(mi => mi.Guid)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<PlayerStat>().HasKey(mi => new { mi.Guid, mi.Id });
        modelBuilder.Entity<PlayerStat>().HasOne(mi => mi.User)
            .WithMany()
            .HasForeignKey(mi => mi.Guid)
            .OnDelete(DeleteBehavior.Cascade);

    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        base.OnConfiguring(optionsBuilder);
        optionsBuilder.UseSqlite($"Data Source={_dbPath}", options => options.MigrationsAssembly("RRH_Minigames_API"));
    }
}
