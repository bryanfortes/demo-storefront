using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StoreAPI.Models;

public class OrderLedger
{
    [Key]
    public long OrderId { get; set; }
    
    [Column(TypeName = "nvarchar(75)")]
    public string OrderNumber { get; set; }
    
    public int CustomerId { get; set; }
    
    public Customer Customer { get; set; }
    
    [Column(TypeName = "nvarchar10")]
    public string Payment { get; set; }
    
    public decimal Total { get; set; }
}