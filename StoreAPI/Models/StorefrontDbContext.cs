using Microsoft.EntityFrameworkCore;

namespace StoreAPI.Models;

public class StorefrontDbContext:DbContext
{
    public StorefrontDbContext(DbContextOptions<StorefrontDbContext> options):base(options)
    {
        
    }
    public DbSet<Customer> Customers { get; set; }
    public DbSet<Item> FoodItems { get; set; }
    public DbSet<OrderLedger> OrderLedgers { get; set; }
    public DbSet<OrderDetail> OrderDetails { get; set; }

}