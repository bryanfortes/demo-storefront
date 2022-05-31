using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StoreAPI.Models;

public class OrderLedger
{
    [Key]
    public long OrderLedgerId { get; set; }
    
    [Column(TypeName = "nvarchar(75)")]
    public string OrderNumber { get; set; }
    
    public int CustomerId { get; set; }
    //Navigational Property | creates foreign key between OrderLedger and Customer
    public Customer Customer { get; set; }
    
    [Column(TypeName = "nvarchar(10)")]
    public string Payment { get; set; }
    
    public decimal Total { get; set; }
    
    public List<OrderDetail> OrderDetails { get; set; }
}