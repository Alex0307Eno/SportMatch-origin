using Microsoft.AspNetCore.Mvc;

namespace SportMatch.Controllers;

public class VenueController : Controller
{
    
    // GET
    public IActionResult Index()
    {
        return View();
    }
}