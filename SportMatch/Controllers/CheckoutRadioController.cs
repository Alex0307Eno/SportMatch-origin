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
        private readonly SportMatchContext MartDb;
        public CheckoutRadioController(SportMatchContext context)
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

            //var userNameAndMobile = await MartDb.Users
            //    .Where(u => u.Email == email)
            //    .Select(u => new { u.Name, u.Mobile })
            //    .ToListAsync();

            var deliveryInfo = await (from u in MartDb.Users
                                      join de in MartDb.DeliveryInfo on u.UserId equals de.UserID
                                      where u.Email == email
                                      select new { de.Address, de.Recepient, de.Phone, u.Name, u.Mobile })
                                      .ToListAsync();

            return Ok(deliveryInfo);
        }
    }
}
