using System;
using System.Collections.Generic;
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
            return await _context.OrderLedgers.ToListAsync();
        }

        // GET: api/Order/5
        [HttpGet("{id}")]
        public async Task<ActionResult<OrderLedger>> GetOrderLedger(long id)
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

            return orderLedger;
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
