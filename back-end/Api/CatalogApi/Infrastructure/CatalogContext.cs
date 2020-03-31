namespace CatalogApi.Infrastructure
{
    using Microsoft.EntityFrameworkCore;
    using Microsoft.EntityFrameworkCore.Metadata.Builders;
    using Model;
    using Microsoft.EntityFrameworkCore.Design;
    using Newtonsoft.Json;
    using System.Collections.Generic;

    public class CatalogContext : DbContext
    {
        public CatalogContext(DbContextOptions<CatalogContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Disc>(a =>
            {
                a.HasKey(c => new { c.Product_key, c.Offering_key, c.Supplier_key });
                a.Property(b => b.tiers).HasConversion(
                    c => JsonConvert.SerializeObject(c, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore }),
                    c => JsonConvert.DeserializeObject<List<Tiers>>(c, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore }));
//                a.Property(b => b.tiers).HasColumnName("Tiers");
 //               a.Ignore(b => b.tiers);
            });
 //           modelBuilder.Query<Disc>().ToView("disc");
        }

        public DbSet<Offerings> offerings { get; set; }
        public DbSet<Products> products { get; set; }
        public DbSet<Suppliers> suppliers { get; set; }
        public DbSet<Disc> disc { get; set; }
    }    
}
