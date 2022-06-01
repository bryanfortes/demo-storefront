using System.ComponentModel.DataAnnotations;

namespace StoreAPI.Models;

public class OrderDetail
{
    [Key]
    public long OrderDetailId { get; set; }
    
    public long OrderLedgerId { get; set; }

    public int FoodItemId { get; set; }
    public FoodItem FoodItem { get; set; }

    public decimal FoodItemPrice { get; set; }
    
    public int Quantity { get; set; }
}