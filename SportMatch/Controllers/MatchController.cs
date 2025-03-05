using Microsoft.AspNetCore.Mvc;
using SportMatch.Models;

namespace SportMatch.Controllers
{
    public class MatchController : Controller
    {
        List<TestForMatch> Player2 = new List<TestForMatch>
                {
                    new TestForMatch { Name = "妙蛙種子", Role = "控球後衛", Image = "../image/MatchPage/001.png" },
                    new TestForMatch { Name = "妙蛙草", Role = "大前鋒", Image = "../image/MatchPage/002.png" },
                    new TestForMatch { Name = "妙蛙花", Role = "中鋒", Image = "../image/MatchPage/003.png" },
                    new TestForMatch { Name = "小火龍", Role = "小前鋒", Image = "../image/MatchPage/004.png" },
                    new TestForMatch { Name = "火恐龍", Role = "得分後衛", Image = "../image/MatchPage/005.png" },
                    new TestForMatch { Name = "噴火龍", Role = "中鋒", Image = "../image/MatchPage/006.png" },
                    new TestForMatch { Name = "噴火龍", Role = "中鋒", Image = "../image/MatchPage/006.png" },
                    new TestForMatch { Name = "噴火龍", Role = "中鋒", Image = "../image/MatchPage/006.png" },
                    new TestForMatch { Name = "火恐龍", Role = "得分後衛", Image = "../image/MatchPage/005.png" },
                    new TestForMatch { Name = "噴火龍", Role = "中鋒", Image = "../image/MatchPage/006.png" },
                    new TestForMatch { Name = "噴火龍", Role = "中鋒", Image = "../image/MatchPage/006.png" },
                    new TestForMatch { Name = "噴火龍", Role = "中鋒", Image = "../image/MatchPage/006.png" },
                    new TestForMatch { Name = "噴火龍", Role = "中鋒", Image = "../image/MatchPage/006.png" },
                    new TestForMatch { Name = "噴火龍", Role = "中鋒", Image = "../image/MatchPage/006.png" },
                    new TestForMatch { Name = "噴火龍", Role = "中鋒", Image = "../image/MatchPage/006.png" },
                    new TestForMatch { Name = "火恐龍", Role = "得分後衛", Image = "../image/MatchPage/005.png" },
                    new TestForMatch { Name = "噴火龍", Role = "中鋒", Image = "../image/MatchPage/006.png" },
                    new TestForMatch { Name = "噴火龍", Role = "中鋒", Image = "../image/MatchPage/006.png" },
                    new TestForMatch { Name = "妙蛙花", Role = "中鋒", Image = "../image/MatchPage/003.png" },
                    new TestForMatch { Name = "小火龍", Role = "小前鋒", Image = "../image/MatchPage/004.png" },
                    new TestForMatch { Name = "火恐龍", Role = "得分後衛", Image = "../image/MatchPage/005.png" },
                    new TestForMatch { Name = "噴火龍", Role = "中鋒", Image = "../image/MatchPage/006.png" },
                    new TestForMatch { Name = "噴火龍", Role = "中鋒", Image = "../image/MatchPage/006.png" },
                    new TestForMatch { Name = "噴火龍", Role = "中鋒", Image = "../image/MatchPage/006.png" },
                    new TestForMatch { Name = "噴火龍", Role = "中鋒", Image = "../image/MatchPage/006.png" },
                    new TestForMatch { Name = "噴火龍", Role = "中鋒", Image = "../image/MatchPage/006.png" },
                    new TestForMatch { Name = "火恐龍", Role = "得分後衛", Image = "../image/MatchPage/005.png" },
                    new TestForMatch { Name = "噴火龍", Role = "中鋒", Image = "../image/MatchPage/006.png" },
                    new TestForMatch { Name = "噴火龍", Role = "中鋒", Image = "../image/MatchPage/006.png" },
                    new TestForMatch { Name = "妙蛙種子", Role = "控球後衛", Image = "../image/MatchPage/001.png" },
                    new TestForMatch { Name = "妙蛙草", Role = "大前鋒", Image = "../image/MatchPage/002.png" },
                    new TestForMatch { Name = "妙蛙花", Role = "中鋒", Image = "../image/MatchPage/003.png" },
                    new TestForMatch { Name = "小火龍", Role = "小前鋒", Image = "../image/MatchPage/004.png" },
                    new TestForMatch { Name = "火恐龍", Role = "得分後衛", Image = "../image/MatchPage/005.png" },
                    new TestForMatch { Name = "噴火龍", Role = "中鋒", Image = "../image/MatchPage/006.png" },
                    new TestForMatch { Name = "噴火龍", Role = "中鋒", Image = "../image/MatchPage/006.png" },
                    new TestForMatch { Name = "噴火龍", Role = "中鋒", Image = "../image/MatchPage/006.png" },
                    new TestForMatch { Name = "火恐龍", Role = "得分後衛", Image = "../image/MatchPage/005.png" },
                    new TestForMatch { Name = "噴火龍", Role = "中鋒", Image = "../image/MatchPage/006.png" },
                    new TestForMatch { Name = "噴火龍", Role = "中鋒", Image = "../image/MatchPage/006.png" },
                    new TestForMatch { Name = "噴火龍", Role = "中鋒", Image = "../image/MatchPage/006.png" },
                    new TestForMatch { Name = "噴火龍", Role = "中鋒", Image = "../image/MatchPage/006.png" },
                    new TestForMatch { Name = "噴火龍", Role = "中鋒", Image = "../image/MatchPage/006.png" },
                    new TestForMatch { Name = "噴火龍", Role = "中鋒", Image = "../image/MatchPage/006.png" },
                    new TestForMatch { Name = "火恐龍", Role = "得分後衛", Image = "../image/MatchPage/005.png" },
                    new TestForMatch { Name = "噴火龍", Role = "中鋒", Image = "../image/MatchPage/006.png" },
                    new TestForMatch { Name = "噴火龍", Role = "中鋒", Image = "../image/MatchPage/006.png" },
                    new TestForMatch { Name = "妙蛙花", Role = "中鋒", Image = "../image/MatchPage/003.png" },
                    new TestForMatch { Name = "小火龍", Role = "小前鋒", Image = "../image/MatchPage/004.png" },
                    new TestForMatch { Name = "火恐龍", Role = "得分後衛", Image = "../image/MatchPage/005.png" },
                    new TestForMatch { Name = "噴火龍", Role = "中鋒", Image = "../image/MatchPage/006.png" },
                    new TestForMatch { Name = "噴火龍", Role = "中鋒", Image = "../image/MatchPage/006.png" },
                    new TestForMatch { Name = "噴火龍", Role = "中鋒", Image = "../image/MatchPage/006.png" },
                    new TestForMatch { Name = "噴火龍", Role = "中鋒", Image = "../image/MatchPage/006.png" },
                    new TestForMatch { Name = "噴火龍", Role = "中鋒", Image = "../image/MatchPage/006.png" },
                    new TestForMatch { Name = "火恐龍", Role = "得分後衛", Image = "../image/MatchPage/005.png" },
                    new TestForMatch { Name = "噴火龍", Role = "中鋒", Image = "../image/MatchPage/006.png" },
                    new TestForMatch { Name = "噴火龍", Role = "中鋒", Image = "../image/MatchPage/006.png" },
                    new TestForMatch { Name = "妙蛙種子", Role = "控球後衛", Image = "../image/MatchPage/001.png" },
                    new TestForMatch { Name = "妙蛙草", Role = "大前鋒", Image = "../image/MatchPage/002.png" },
                    new TestForMatch { Name = "妙蛙花", Role = "中鋒", Image = "../image/MatchPage/003.png" },
                    new TestForMatch { Name = "小火龍", Role = "小前鋒", Image = "../image/MatchPage/004.png" },
                    new TestForMatch { Name = "火恐龍", Role = "得分後衛", Image = "../image/MatchPage/005.png" },
                    new TestForMatch { Name = "噴火龍", Role = "中鋒", Image = "../image/MatchPage/006.png" },
                    new TestForMatch { Name = "噴火龍", Role = "中鋒", Image = "../image/MatchPage/006.png" },
                    new TestForMatch { Name = "噴火龍", Role = "中鋒", Image = "../image/MatchPage/006.png" },
                    new TestForMatch { Name = "火恐龍", Role = "得分後衛", Image = "../image/MatchPage/005.png" },
                    new TestForMatch { Name = "噴火龍", Role = "中鋒", Image = "../image/MatchPage/006.png" },
                    new TestForMatch { Name = "噴火龍", Role = "中鋒", Image = "../image/MatchPage/006.png" },
                    new TestForMatch { Name = "噴火龍", Role = "中鋒", Image = "../image/MatchPage/006.png" },
                    new TestForMatch { Name = "噴火龍", Role = "中鋒", Image = "../image/MatchPage/006.png" },
                };

        public IActionResult MatchPage(int page = 1)
        {

            //int itemsPerPage = 8; // 每頁顯示 8 個 Card
            //int totalItems = Player2.Count();  // 總共有幾個 Card
            //int totalPages = (int)Math.Ceiling((double)totalItems / itemsPerPage); // 換算有幾頁

            //// 取得當前頁要顯示的 Card
            //List<TestForMatch> paginatedCards = Player2.Skip((page - 1) * itemsPerPage).Take(itemsPerPage).ToList();

            //ViewData["789"] = paginatedCards;
            //ViewBag.CurrentPage = page;
            //ViewBag.TotalPages = totalPages;

            return View();
        }

        [HttpGet]
        public JsonResult GetCards(int page, int pageSize)
        {
            var cards = Player2.Skip((page - 1) * pageSize).Take(pageSize).ToList();
            int totalPages = (int)Math.Ceiling((double)Player2.Count / pageSize);

            return Json(new { cards, totalPages });
        }

        [HttpPost]
        public IActionResult GetSelection(string MatchType, string MatchArea, string MatchRole, string MatchGender)
        {
            ViewBag.MatchType = MatchType;
            ViewBag.MatchArea = MatchArea;
            ViewBag.MatchRole = MatchRole;
            ViewBag.MatchGender = MatchGender;

            return View("MatchPage");
        }
    }
}
