using Microsoft.AspNetCore.Mvc;

namespace SportMatch.Controllers;

public class ContactUsController : Controller
{
    // GET
    public IActionResult Index()
    {
        return View();
    }
}