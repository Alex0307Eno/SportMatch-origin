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
                new { Id=1, EventName = "台中公益盃",EventDate = "2025/03/06",TargetTime = DateTime.UtcNow.AddDays(3) },
                new { Id=2, EventName = "資展學生球賽",EventDate = "2025/03/08",TargetTime = DateTime.UtcNow.AddDays(5) },
                new { Id=3, EventName = "冠軍盃",EventDate = "2025/03/04", TargetTime = DateTime.UtcNow.AddDays(1) },
                new { Id=4, EventName = "聯合球賽",EventDate = "2025/03/18",TargetTime = DateTime.UtcNow.AddDays(15) },
                new { Id=5, EventName = "夢幻音樂盃",EventDate = "2025/03/10",TargetTime = DateTime.UtcNow.AddDays(7) },
                new { Id=6, EventName = "西屯公所盃",EventDate = "2025/03/15",TargetTime = DateTime.UtcNow.AddDays(12) },
                new { Id=7, EventName = "台中大專交流賽",EventDate = "2025/04/02",TargetTime = DateTime.UtcNow.AddDays(30) },
                new { Id=8, EventName = "中區學生球賽",EventDate = "2025/04/07",TargetTime = DateTime.UtcNow.AddDays(35) },
                new { Id=9, EventName = "職人盃",EventDate = "2025/03/13",TargetTime = DateTime.UtcNow.AddDays(10) },
                new { Id=10, EventName = "台中公益盃1",EventDate = "2025/03/06",TargetTime = DateTime.UtcNow.AddDays(3) },
                new { Id=11, EventName = "資展學生賽1",EventDate = "2025/03/08",TargetTime = DateTime.UtcNow.AddDays(5) },
                new { Id=12, EventName = "冠軍盃1",EventDate = "2025/03/04", TargetTime = DateTime.UtcNow.AddDays(1) },
                new { Id=13, EventName = "聯合球賽1",EventDate = "2025/03/18",TargetTime = DateTime.UtcNow.AddDays(15) },
                new { Id=14, EventName = "夢幻音樂盃1",EventDate = "2025/03/10",TargetTime = DateTime.UtcNow.AddDays(7) },
                new { Id=15, EventName = "西屯公所盃1",EventDate = "2025/03/15",TargetTime = DateTime.UtcNow.AddDays(12) },
                new { Id=16, EventName = "台中交流賽1",EventDate = "2025/04/02",TargetTime = DateTime.UtcNow.AddDays(30) },
                new { Id=17, EventName = "中區學生賽1",EventDate = "2025/04/07",TargetTime = DateTime.UtcNow.AddDays(35) },
                new { Id=18, EventName = "職人盃1",EventDate = "2025/03/13",TargetTime = DateTime.UtcNow.AddDays(10) },
                new { Id=19, EventName = "台中公益盃2",EventDate = "2025/03/06",TargetTime = DateTime.UtcNow.AddDays(3) },
                new { Id=20, EventName = "資展學生賽2",EventDate = "2025/03/08",TargetTime = DateTime.UtcNow.AddDays(5) },
                new { Id=21, EventName = "冠軍盃2",EventDate = "2025/03/04", TargetTime = DateTime.UtcNow.AddDays(1) },
                new { Id=22, EventName = "聯合球賽2",EventDate = "2025/03/18",TargetTime = DateTime.UtcNow.AddDays(15) },
                new { Id=23, EventName = "夢幻音樂盃2",EventDate = "2025/03/10",TargetTime = DateTime.UtcNow.AddDays(7) },
                new { Id=24, EventName = "西屯公所盃2",EventDate = "2025/03/15",TargetTime = DateTime.UtcNow.AddDays(12) },
                new { Id=25, EventName = "台中交流賽2",EventDate = "2025/04/02",TargetTime = DateTime.UtcNow.AddDays(30) },
                new { Id=26, EventName = "中區學生賽2",EventDate = "2025/04/07",TargetTime = DateTime.UtcNow.AddDays(35) },
                new { Id=27, EventName = "職人盃2",EventDate = "2025/03/13",TargetTime = DateTime.UtcNow.AddDays(10) },
                new { Id=28, EventName = "台中公益盃3",EventDate = "2025/03/06",TargetTime = DateTime.UtcNow.AddDays(3) },
                new { Id=29, EventName = "資展學生賽3",EventDate = "2025/03/08",TargetTime = DateTime.UtcNow.AddDays(5) },
                new { Id=30, EventName = "冠軍盃3",EventDate = "2025/03/04", TargetTime = DateTime.UtcNow.AddDays(1) },
                new { Id=31, EventName = "聯合球賽3",EventDate = "2025/03/18",TargetTime = DateTime.UtcNow.AddDays(15) },
                new { Id=32, EventName = "夢幻音樂盃3",EventDate = "2025/03/10",TargetTime = DateTime.UtcNow.AddDays(7) },
                new { Id=33, EventName = "西屯公所盃3",EventDate = "2025/03/15",TargetTime = DateTime.UtcNow.AddDays(12) },
                new { Id=34, EventName = "台中交流賽3",EventDate = "2025/04/02",TargetTime = DateTime.UtcNow.AddDays(30) },
                new { Id=35, EventName = "中區學生賽3",EventDate = "2025/04/07",TargetTime = DateTime.UtcNow.AddDays(35) },
                new { Id=36, EventName = "職人盃3",EventDate = "2025/03/13",TargetTime = DateTime.UtcNow.AddDays(10) }
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
