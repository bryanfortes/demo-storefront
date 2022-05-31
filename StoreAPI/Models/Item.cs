using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StoreAPI.Models;

public class Item
{
    [Key]
    public int ItemId { get; set; }
    
    [Column(TypeName = "nvarchar(100)")]
    public string ItemName { get; set; }
    
    public decimal Price { get; set; }
}