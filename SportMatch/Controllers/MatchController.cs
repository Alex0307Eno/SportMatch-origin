using Microsoft.AspNetCore.Mvc;

namespace SportMatch.Controllers
{
    public class MatchController : Controller
    {
        public IActionResult MatchPage()
        {
            return View();
        }
    }
}
