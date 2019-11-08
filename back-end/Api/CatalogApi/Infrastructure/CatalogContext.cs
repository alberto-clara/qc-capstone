namespace CatalogApi.Infrastructure
{
    using Microsoft.EntityFrameworkCore;
    using Model;
    using Microsoft.EntityFrameworkCore.Design;

    public class CatalogContext : DbContext
    {

        public CatalogContext(DbContextOptions<CatalogContext> options) : base(options)
        {
        }
        public DbSet<CatalogOfferings> CatalogOfferings { get; set; }
        public DbSet<Products> products { get; set; }
        public DbSet<CatalogSuppliers> CatalogSuppliers { get; set; }

    }

    
}
