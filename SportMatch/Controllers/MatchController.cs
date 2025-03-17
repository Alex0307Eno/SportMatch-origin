using System.Diagnostics;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NuGet.Protocol.Plugins;
using SportMatch.Models;
using static SportMatch.Controllers.DoorController;

namespace SportMatch.Controllers
{

    public class MatchController : Controller
    {
        // 導入資料庫
        private readonly SportMatchContext _context;
        public MatchController(SportMatchContext context)
        {
            _context = context;
        }

        public IActionResult MatchPage()
        {

            return View();
        }

        // 接收Localstorage的資料
        [HttpPost]
        public IActionResult ReceiveLocalStorage([FromBody] string userInfo)
        {
            if (userInfo != null && !string.IsNullOrEmpty(userInfo))
            {
                HttpContext.Session.SetString("UserInfo", userInfo); // 把接收到的信箱存入 Session
                //UserInfo = userInfo; // 把接收到的信箱存起來
                return Json(new { success = true, message = "資料已接收", receivedValue = userInfo });
            }
            return Json(new { success = false, message = "未接收到有效資料" });
        }

        // 取得卡片資料
        [HttpGet]
        public JsonResult GetCards(int page, int pageSize)
        {
            var UserInfoFromSQL = (from u in _context.Users
                                   join r in _context.Roles
                                   on u.RoleId equals r.RoleId
                                   select new { UserID = u.UserId, Name = u.Name, Role = r.RoleName, Memo = u.UserMemo, Image = u.UserPic }).ToList();


            // 從Session取得使用者資訊到資料庫查詢符合的詳細資料
            string UserInfo = HttpContext.Session.GetString("UserInfo")!; // 從 Session 取出
            var UserInfoForSuggest = (from u in _context.Users
                                      where u.Email.ToString().ToLower() == UserInfo.ToLower()
                                      select u).ToList();

            // 推薦與使用者擅長位置以及招募性別相同的隊伍
            var TeamInfoFromSQL = (from t in _context.Teams
                                   join r in _context.Roles
                                   on t.RoleId equals r.RoleId
                                   where t.RoleId == UserInfoForSuggest[0].RoleId && t.GenderId == UserInfoForSuggest[0].GenderId
                                   select new { TeamID = t.UserId, Name = t.TeamName, Role = r.RoleName, Memo = t.TeamMemo, Image = t.TeamPic }).ToList();

            // 符合條件小於6筆則取招募性別與使用者相同的隊伍
            if (TeamInfoFromSQL.Count() < 6)
            {
                TeamInfoFromSQL = (from t in _context.Teams
                                   join r in _context.Roles
                                   on t.RoleId equals r.RoleId
                                   where t.GenderId == UserInfoForSuggest[0].GenderId && t.SportId == UserInfoForSuggest[0].SportId
                                   select new { TeamID = t.UserId, Name = t.TeamName, Role = r.RoleName, Memo = t.TeamMemo, Image = t.TeamPic }).ToList();
            }

            int totalItems = TeamInfoFromSQL.Count();
            int totalPages = (int)Math.Ceiling((double)totalItems / pageSize);
            var cards = TeamInfoFromSQL.Skip((page - 1) * pageSize).Take(pageSize).ToList();

            return Json(new { cards, totalPages, totalItems });
        }

        // 取得賽事資料
        [HttpGet]
        public JsonResult GetEvent()
        {
            // 從資料庫帶出查詢結果
            var Event = from e in _context.Events
                        join g in _context.Genders
                        on e.GenderId equals g.GenderId
                        join s in _context.Sports
                        on e.SportId equals s.SportId
                        join a in _context.Areas
                        on e.AreaId equals a.AreaId
                        select new { Name = e.EventName, Gender = g.GenderType, Sport = s.SportName, Area = a.AreaName };

            // 宣告三個空的字串清單準備存資料
            List<string> BasketballEventList = new List<string>();
            List<string> ValleyballEventList = new List<string>();
            List<string> BadmintonEventList = new List<string>();

            // 把對應的運動種類內的賽事放入對應的清單
            foreach (var item in Event)
            {
                if (item.Sport == "BasketBall")
                {
                    BasketballEventList.Add(item.Name);
                }

                if (item.Sport == "ValleyBall")
                {
                    ValleyballEventList.Add(item.Name);
                }

                if (item.Sport == "Badminton")
                {
                    BadmintonEventList.Add(item.Name);
                }
            }

            return Json(new { BasketballEventList, ValleyballEventList, BadmintonEventList });
        }

        // 篩選功能
        [HttpPost]
        public IActionResult GetSelection(string MatchType, string MatchCategory, List<string> MatchEvent, List<string> MatchArea, List<string> MatchRole)
        {
            int SportType = 0;
            switch (MatchCategory)
            {
                case "badminton":
                    SportType = 3;
                    break;
                case "valleyball":
                    SportType = 2;
                    break;
                default:
                    SportType = 1;
                    break;
            }
            if (MatchType == "FindPlayer")
            {
                var filterPlayer = (from u in _context.Users
                                    join r in _context.Roles
                                    on u.RoleId equals r.RoleId
                                    where r.SportId == SportType
                                    select new { UserID = u.UserId, Name = u.Name, Role = r.RoleName, Memo = u.UserMemo, Image = u.UserPic }).ToList();

                if (MatchEvent.Count() > 0)
                {
                    filterPlayer = (from u in _context.Users
                                    join r in _context.Roles
                                    on u.RoleId equals r.RoleId
                                    where r.SportId == SportType
                                    select new { UserID = u.UserId, Name = u.Name, Role = r.RoleName, Memo = u.UserMemo, Image = u.UserPic }).ToList();
                    if (MatchRole.Count() > 0)
                    {
                        filterPlayer = (from u in _context.Users
                                        join r in _context.Roles
                                        on u.RoleId equals r.RoleId
                                        where MatchRole.Contains(r.RoleName)
                                        select new { UserID = u.UserId, Name = u.Name, Role = r.RoleName, Memo = u.UserMemo, Image = u.UserPic }).ToList();
                    }
                }



            }
            else if (MatchType == "FindTeam")
            {

            }


            if (MatchType == null)
            {
                ViewBag.MatchType = null;
                return View("MatchPage");
            }
            else
            {
                ViewBag.MatchType = MatchType;
                ViewBag.MatchCategory = MatchCategory;
                ViewBag.MatchEvent = MatchEvent;
                ViewBag.MatchArea = MatchArea;
                ViewBag.MatchRole = MatchRole;
                return View("MatchPage");
            }
        }

        // 篩選列功能
        [HttpGet]
        public JsonResult GetRole(string selectedSport)
        {
            // 從資料庫調出運動與對應的位置
            var Role = (from r in _context.Roles
                        join s in _context.Sports
                        on r.SportId equals s.SportId into sportGroup
                        from s in sportGroup.DefaultIfEmpty() // LEFT JOIN
                        select new
                        {
                            RoleName = r.RoleName,
                            SportName = s != null ? s.SportName : "N/A"
                        }).ToList();

            // 篩選列球類點擊時，資料傳入controller判斷種類回傳對應位置
            if (selectedSport != null)
            {
                List<string> RoleList = new List<string>();
                foreach (var item in Role)
                {
                    if (item.SportName.ToLower() == selectedSport.ToLower())
                    {
                        RoleList.Add(item.RoleName);
                    }
                }
                return Json(new { RoleList });
            }
            else
            {
                return Json(new { message = "未找到對應的運動" });
            }
        }
    }
}
