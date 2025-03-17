using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Newtonsoft.Json;
using SportMatch.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using static SportMatch.Controllers.MartController;

namespace SportMatch.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BillController : ControllerBase
    {
        public class CheckoutData
        {
            public int id { get; set; }
            public int quantity { get; set; }
            public string billNumber { get; set; }
        }

        [HttpPost]
        public async Task<IActionResult> CartInfo([FromBody] List<CheckoutData> checkoutData)
        {
            Console.WriteLine(JsonConvert.SerializeObject(checkoutData, Formatting.Indented));
            return Ok(checkoutData);
        }
    }
}
