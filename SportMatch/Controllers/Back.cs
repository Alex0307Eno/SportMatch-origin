using Microsoft.AspNetCore.Mvc;

namespace SportMatch.Controllers
{
    public class Back : Controller
    {
        public IActionResult Backstage()
        {
            return View();
        }
    }
}
