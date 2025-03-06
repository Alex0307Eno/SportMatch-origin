using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using SportMatch.Models;

namespace SportMatch.Controllers
{
    public class EventController : Controller
    {
        public IActionResult EventPage()
        {
            var countdowns = new List<object>
            {
                new { Id = "台中公益盃",EventDate = "2025/03/06",TargetTime = DateTime.UtcNow.AddDays(3) },
                new { Id = "資展學生球賽",EventDate = "2025/03/08",TargetTime = DateTime.UtcNow.AddDays(5) },
                new { Id = "冠軍盃",EventDate = "2025/03/04", TargetTime = DateTime.UtcNow.AddDays(1) },
                new { Id = "聯合球賽",EventDate = "2025/03/18",TargetTime = DateTime.UtcNow.AddDays(15) },
                new { Id = "夢幻音樂盃",EventDate = "2025/03/10",TargetTime = DateTime.UtcNow.AddDays(7) },
                new { Id = "西屯公所盃",EventDate = "2025/03/15",TargetTime = DateTime.UtcNow.AddDays(12) },
                new { Id = "台中大專交流賽",EventDate = "2025/04/02",TargetTime = DateTime.UtcNow.AddDays(30) },
                new { Id = "中區學生球賽",EventDate = "2025/04/07",TargetTime = DateTime.UtcNow.AddDays(35) },
                new { Id = "職人盃",EventDate = "2025/03/13",TargetTime = DateTime.UtcNow.AddDays(10) }
            };
            ViewBag.Countdowns = countdowns;
            // 模擬從資料庫取得標記日期（可替換為 SQL Server 讀取）
            List<EventPageModel> events = new List<EventPageModel>
            {
                new EventPageModel { Id = 1, EventDate = new DateTime(2025, 3, 08), Description = "資展學生球賽" },
                new EventPageModel { Id = 2, EventDate = new DateTime(2025, 3, 15), Description = "西屯公所盃" }
            };
            //events放入:問題待解決
            return View();
        }

        public IActionResult JoinPage()
        {
            return View();
        }
    }
}
