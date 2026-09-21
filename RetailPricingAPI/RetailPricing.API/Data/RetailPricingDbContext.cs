using Microsoft.EntityFrameworkCore;
using RetailPricing.API.Models;

namespace RetailPricing.API.Data
{
    public class RetailPricingDbContext : DbContext
    {
        public RetailPricingDbContext(DbContextOptions<RetailPricingDbContext> options) : base(options) { }
        public DbSet<Models.RetailPricing> RetailPricings { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Models.RetailPricing>().ToTable("RetailPricing");
        }
    }
}
