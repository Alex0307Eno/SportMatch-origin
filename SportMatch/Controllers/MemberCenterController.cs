using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using SportMatch.Models;

namespace SportMatch.Controllers;

public class MemberCenterController : Controller
{
    public override void OnActionExecuting(ActionExecutingContext context)
    {
        ViewData["MenuItems"] = new List<MenuItem>
        {
            new MenuItem("fa-solid fa-house", "會員中心", "/MemberCenter/Index"),
            new MenuItem("fas fa-user", "帳號資訊", "/MemberCenter/Account"),
            new MenuItem("fas fa-bell", "通知中心", "/MemberCenter/NotificationCenter"),
            new MenuItem("fa-solid fa-trophy", "運動活動", "/MemberCenter/SportsEvents"),
            new MenuItem("fas fa-heart", "我的最愛", "/MemberCenter/MyFav"),
            new MenuItem("fas fa-history", "歷史紀錄", "/MemberCenter/HistoryRecords")
        };

        base.OnActionExecuting(context);
    }

    public IActionResult Index()
    {
        return View();
    }
    public IActionResult Account()
    {
        return View();
    }
    public IActionResult NotificationCenter()
    {
        return View();
    }
    public IActionResult SportsEvents()
    {
        return View();
    }
    public IActionResult MyFav()
    {
        return View();
    } public IActionResult HistoryRecords()
    {
        return View();
    }
}