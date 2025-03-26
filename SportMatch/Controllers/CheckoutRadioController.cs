using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Newtonsoft.Json;
using SportMatch.Models;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using static SportMatch.Controllers.CheckoutController;
using static SportMatch.Controllers.MartController;

namespace SportMatch.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CheckoutRadioController : ControllerBase
    {
        private readonly SportMatchV1Context MartDb;
        public CheckoutRadioController(SportMatchV1Context context)
        {
            MartDb = context;
        }

        public class loggedInEmail 
        {
            public string Email { get; set; }
        }

        [HttpPost]
        public async Task<IActionResult> CheckoutRadioInfo([FromBody] List<loggedInEmail> _loggedInEmail)
        {
            var email = _loggedInEmail?.FirstOrDefault()?.Email;

            var deliveryInfo = await (from u in MartDb.Users
                                      join de in MartDb.DeliveryInfos on u.UserId equals de.UserId
                                      where u.Email == email
                                      select new { de.Address, de.Recepient, de.Phone, u.Name, u.Mobile })
                                      .ToListAsync();

            return Ok(deliveryInfo);
        }
    }
}
