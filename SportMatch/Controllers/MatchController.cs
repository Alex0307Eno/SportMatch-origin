using Microsoft.AspNetCore.Mvc;
using SportMatch.Models;

namespace SportMatch.Controllers
{
    public class MatchController : Controller
    {
        public IActionResult MatchPage()
        {
            TestForMatch Player1 = new TestForMatch();
            Player1.Name = "妙蛙種子";
            Player1.Role = "控球後衛";
            Player1.Image = "/image/MatchPage/001.png";

            List<TestForMatch> Player2 = new List<TestForMatch>
            {
                new TestForMatch{Name="妙蛙種子",Role="控球後衛",Image="../image/MatchPage/001.png"},
                new TestForMatch{Name="妙蛙草", Role="大前鋒", Image="../image/MatchPage/002.png"},
                new TestForMatch{Name="妙蛙花", Role="中鋒", Image="../image/MatchPage/003.png"},
                new TestForMatch{Name="小火龍", Role="小前鋒",Image="../image/MatchPage/004.png"},
                new TestForMatch{Name="火恐龍", Role="得分後衛",Image="../image/MatchPage/005.png"},
                new TestForMatch{Name="噴火龍", Role="中鋒", Image="../image/MatchPage/006.png"},
                new TestForMatch{Name="噴火龍", Role="中鋒", Image="../image/MatchPage/006.png"},
                new TestForMatch{Name="噴火龍", Role="中鋒", Image="../image/MatchPage/006.png"}
            };


            ViewData["123"] = Player1;
            ViewBag.Player2 = Player2;
            ViewData["456"] = Player2;
            return View();
        }
    }
}
