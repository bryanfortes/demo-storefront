using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StoreAPI.Models;

namespace StoreAPI
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly StorefrontDbContext _context;

        public OrderController(StorefrontDbContext context)
        {
            _context = context;
        }

        // GET: api/Order
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderLedger>>> GetOrderLedgers()
        {
          if (_context.OrderLedgers == null)
          {
              return NotFound();
          }
          return await _context.OrderLedgers.Include(x=> x.Customer).ToListAsync();
        }

        // GET: api/Order/5
        [HttpGet("{id}")]
        public async Task<ActionResult<OrderLedger>> GetOrderLedger(long id)
        {
          if (_context.OrderLedgers == null)
          {
              return NotFound();
          }
            //get item from order details
            var orderDetails = await (from ledger in _context.Set<OrderLedger>()
                                      join detail in _context.Set<OrderDetail>() 
                                      on ledger.OrderLedgerId equals detail.OrderLedgerId
                                      join foodItem in _context.Set<FoodItem>()
                                      on detail.FoodItemId equals foodItem.FoodItemId
                                      where ledger.OrderLedgerId == id
                                      
                                      select new
                                      {
                                          ledger.OrderLedgerId,
                                          detail.OrderDetailId,
                                          detail.FoodItemId,
                                          detail.Quantity,
                                          detail.FoodItemPrice,
                                          foodItem.FoodItemName
                                      }).ToListAsync();
            //get order ledger
            var orderLedger = await (from a in _context.Set<OrderLedger>()
                where a.OrderLedgerId == id
                select new
                {
                    a.OrderLedgerId,
                    a.OrderNumber,
                    a.CustomerId,
                    a.Payment,
                    a.Total,
                    deletedOrderItemIds = "",
                    orderDetails = orderDetails
                }).FirstOrDefaultAsync();

            if (orderLedger == null)
            {
                return NotFound();
            }

            return Ok(orderLedger);
        }

        // PUT: api/Order/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOrderLedger(long id, OrderLedger orderLedger)
        {
            if (id != orderLedger.OrderLedgerId)
            {
                return BadRequest();
            }

            _context.Entry(orderLedger).State = EntityState.Modified;
            
            //existing food items &newly added food items
            foreach (OrderDetail item in orderLedger.OrderDetails)
            {
                if (item.OrderDetailId == 0)
                    _context.OrderDetails.Add(item);
                else
                    _context.Entry(item).State = EntityState.Modified;
                
            }

            foreach (var i in orderLedger.DeletedOrderItemIds.Split(',').Where(x => x != ""))
            {
                OrderDetail y = _context.OrderDetails.Find(Convert.ToInt64(i));
                _context.OrderDetails.Remove(y);
            }
            
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OrderLedgerExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Order
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<OrderLedger>> PostOrderLedger(OrderLedger orderLedger)
        {
          if (_context.OrderLedgers == null)
          {
              return Problem("Entity set 'StorefrontDbContext.OrderLedgers'  is null.");
          }
            _context.OrderLedgers.Add(orderLedger);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetOrderLedger", new { id = orderLedger.OrderLedgerId }, orderLedger);
        }

        // DELETE: api/Order/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrderLedger(long id)
        {
            if (_context.OrderLedgers == null)
            {
                return NotFound();
            }
            var orderLedger = await _context.OrderLedgers.FindAsync(id);
            if (orderLedger == null)
            {
                return NotFound();
            }

            _context.OrderLedgers.Remove(orderLedger);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool OrderLedgerExists(long id)
        {
            return (_context.OrderLedgers?.Any(e => e.OrderLedgerId == id)).GetValueOrDefault();
        }
    }
}
