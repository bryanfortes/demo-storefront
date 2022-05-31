using System.ComponentModel.DataAnnotations;

namespace StoreAPI.Models;

public class OrderDetail
{
    [Key]
    public long OrderDetailId { get; set; }
    
    public long OrderLedgerId { get; set; }
    
    public OrderLedger OrderLedger { get; set; }
    
    public int ItemId { get; set; }
    
    public Item Item { get; set; }

    public decimal ItemPrice { get; set; }
    
    public int Quantity { get; set; }
}