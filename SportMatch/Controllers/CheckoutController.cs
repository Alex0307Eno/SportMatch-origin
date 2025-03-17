using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SportMatch.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using static SportMatch.Controllers.MartController;

[Route("api/[controller]")]
[ApiController]
public class CheckoutController : ControllerBase
{
    private readonly SportMatchContext MartDb;
    public CheckoutController(SportMatchContext context)
    {
        MartDb = context;
    }

    [HttpGet]
    public IActionResult GetCartInfo(int productID, int productQuantity)
    {
        Console.WriteLine($"ID:{productID}, 數量:{productQuantity}");        
        return Ok();
    }
}
