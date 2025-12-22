using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ProductInventoryApi.Models;

namespace ProductInventoryApi.Data
{
    public class ProductsDBContext : IdentityDbContext<ApplicationUser>
    {
        public ProductsDBContext(DbContextOptions<ProductsDBContext> options)
            : base(options)
        {
        }

        public DbSet<Product> Products => Set<Product>();
    }
}
