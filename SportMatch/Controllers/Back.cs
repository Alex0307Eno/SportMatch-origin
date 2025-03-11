using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace SportMatch.Controllers
{
    [Authorize(Roles = "vendor")]

    public class Back : Controller
    {
        public IActionResult Backstage()
        {
            return View();
        }
    }
}
