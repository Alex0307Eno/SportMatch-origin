using System.Diagnostics;
using System.Drawing.Printing;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using NuGet.Protocol.Plugins;
using SportMatch.Models;
using static System.Runtime.InteropServices.JavaScript.JSType;
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
        public JsonResult GetSelection([FromBody] SelectionRequestModel model, int pageSize = 6)
        {
            // 取得使用者資料
            string UserInfo = HttpContext.Session.GetString("UserInfo")!; // 從 Session 取出
            var UserInfoForSuggest = (from u in _context.Users
                                      where u.Email.ToString().ToLower() == UserInfo.ToLower()
                                      select u).ToList();

            // 確認運動種類
            int SportType = 0;
            switch (model.MatchCategory)
            {
                case "badminton":
                    SportType = 3;
                    break;
                case "valleyball":
                    SportType = 2;
                    break;
                default:
                    SportType = 1; // 什麼都沒選預設為羽球
                    break;
            }

            model.MatchEvent ??= new List<string>();
            model.MatchArea ??= new List<string>();
            model.MatchRole ??= new List<string>();

            // 選擇招募隊員
            if (model.MatchType == "FindPlayer")
            {

                List<SelectViewModel> filterPlayer = (from u in _context.Users
                                                      join r in _context.Roles
                                                      on u.RoleId equals r.RoleId
                                                      where r.SportId == SportType && u.GenderId == UserInfoForSuggest[0].GenderId
                                                      select new SelectViewModel { UserID = u.UserId, Name = u.Name, Role = r.RoleName, Memo = u.UserMemo, Image = u.UserPic }).ToList();

                int totalItems = filterPlayer.Count();
                int totalPages = (int)Math.Ceiling((double)totalItems / pageSize);
                var cards = filterPlayer.Skip((model.Page - 1) * pageSize).Take(pageSize).ToList();
                HttpContext.Session.SetString("filterPlayer", JsonConvert.SerializeObject(filterPlayer));
                HttpContext.Session.SetInt32("totalItems", totalItems);
                HttpContext.Session.SetInt32("totalPages", totalPages);



                if (model.MatchRole.Count() > 0 && model.MatchArea.Count() > 0)
                {
                    filterPlayer = (from u in _context.Users
                                    join r in _context.Roles
                                    on u.RoleId equals r.RoleId
                                    join a in _context.Areas
                                    on u.AreaId equals a.AreaId
                                    where r.SportId == SportType && u.GenderId == UserInfoForSuggest[0].GenderId && model.MatchArea.Contains(a.AreaName) && model.MatchRole.Contains(r.RoleName)
                                    select new SelectViewModel { UserID = u.UserId, Name = u.Name, Role = r.RoleName, Memo = u.UserMemo, Image = u.UserPic }).ToList();
                    totalItems = filterPlayer.Count();
                    totalPages = (int)Math.Ceiling((double)totalItems / pageSize);
                    cards = filterPlayer.Skip((model.Page - 1) * pageSize).Take(pageSize).ToList();
                    HttpContext.Session.SetString("filterPlayer", JsonConvert.SerializeObject(filterPlayer));
                    HttpContext.Session.SetInt32("totalItems", totalItems);
                    HttpContext.Session.SetInt32("totalPages", totalPages);
                    return Json(new { cards, totalPages, totalItems });
                }

                else if (model.MatchArea.Count() > 0)
                {
                    filterPlayer = (from u in _context.Users
                                    join r in _context.Roles
                                    on u.RoleId equals r.RoleId
                                    join a in _context.Areas
                                    on u.AreaId equals a.AreaId
                                    where r.SportId == SportType && u.GenderId == UserInfoForSuggest[0].GenderId && model.MatchArea.Contains(a.AreaName)
                                    select new SelectViewModel { UserID = u.UserId, Name = u.Name, Role = r.RoleName, Memo = u.UserMemo, Image = u.UserPic }).ToList();

                    totalItems = filterPlayer.Count();
                    totalPages = (int)Math.Ceiling((double)totalItems / pageSize);
                    cards = filterPlayer.Skip((model.Page - 1) * pageSize).Take(pageSize).ToList();
                    HttpContext.Session.SetString("filterPlayer", JsonConvert.SerializeObject(filterPlayer));
                    HttpContext.Session.SetInt32("totalItems", totalItems);
                    HttpContext.Session.SetInt32("totalPages", totalPages);
                    return Json(new { cards, totalPages, totalItems });
                }

                else if (model.MatchRole.Count() > 0)
                {
                    filterPlayer = (from u in _context.Users
                                    join r in _context.Roles
                                    on u.RoleId equals r.RoleId
                                    where model.MatchRole.Contains(r.RoleName) && u.GenderId == UserInfoForSuggest[0].GenderId
                                    select new SelectViewModel { UserID = u.UserId, Name = u.Name, Role = r.RoleName, Memo = u.UserMemo, Image = u.UserPic }).ToList();
                    totalItems = filterPlayer.Count();
                    totalPages = (int)Math.Ceiling((double)totalItems / pageSize);
                    cards = filterPlayer.Skip((model.Page - 1) * pageSize).Take(pageSize).ToList();
                    HttpContext.Session.SetString("filterPlayer", JsonConvert.SerializeObject(filterPlayer));
                    HttpContext.Session.SetInt32("totalItems", totalItems);
                    HttpContext.Session.SetInt32("totalPages", totalPages);
                    return Json(new { cards, totalPages, totalItems });
                }

                return Json(new { cards, totalPages, totalItems });

            }

            // 選擇加入隊伍
            else
            {
                // 什麼都不選預設帶出羽球隊伍資料
                List<SelectViewModel> filterTeam = (from t in _context.Teams
                                                    join r in _context.Roles
                                                    on t.RoleId equals r.RoleId
                                                    where t.SportId == SportType && t.GenderId == UserInfoForSuggest[0].GenderId
                                                    select new SelectViewModel { TeamID = t.TeamId, Name = t.TeamName, Role = r.RoleName, Memo = t.TeamMemo, Image = t.TeamPic }).ToList();

                int totalItems = filterTeam.Count();
                int totalPages = (int)Math.Ceiling((double)totalItems / pageSize);
                var cards = filterTeam.Skip((model.Page - 1) * pageSize).Take(pageSize).ToList();
                HttpContext.Session.SetString("filterTeam", JsonConvert.SerializeObject(filterTeam));
                HttpContext.Session.SetInt32("totalItems", totalItems);
                HttpContext.Session.SetInt32("totalPages", totalPages);

                // 選擇賽事且選擇招募位置時
                if (model.MatchEvent.Count() > 0 && model.MatchRole.Count() > 0)
                {
                    filterTeam = (from t in _context.Teams
                                  join r in _context.Roles
                                  on t.RoleId equals r.RoleId
                                  join e in _context.Events
                                  on t.EventId equals e.EventId
                                  where t.SportId == SportType && t.GenderId == UserInfoForSuggest[0].GenderId && model.MatchEvent.Contains(e.EventName) && model.MatchRole.Contains(r.RoleName)
                                  select new SelectViewModel { TeamID = t.TeamId, Name = t.TeamName, Role = r.RoleName, Memo = t.TeamMemo, Image = t.TeamPic }).ToList();
                    totalItems = filterTeam.Count();
                    totalPages = (int)Math.Ceiling((double)totalItems / pageSize);
                    cards = filterTeam.Skip((model.Page - 1) * pageSize).Take(pageSize).ToList();
                    HttpContext.Session.SetString("filterTeam", JsonConvert.SerializeObject(filterTeam));
                    HttpContext.Session.SetInt32("totalItems", totalItems);
                    HttpContext.Session.SetInt32("totalPages", totalPages);
                    return Json(new { cards, totalPages, totalItems });
                }

                // 選擇位置與區域
                else if (model.MatchRole.Count() > 0 && model.MatchArea.Count() > 0)
                {
                    filterTeam = (from t in _context.Teams
                                  join r in _context.Roles
                                  on t.RoleId equals r.RoleId
                                  join e in _context.Events
                                  on t.EventId equals e.EventId
                                  join a in _context.Areas
                                  on t.AreaId equals a.AreaId
                                  where t.SportId == SportType && t.GenderId == UserInfoForSuggest[0].GenderId && model.MatchRole.Contains(r.RoleName) && model.MatchArea.Contains(a.AreaName)
                                  select new SelectViewModel { TeamID = t.TeamId, Name = t.TeamName, Role = r.RoleName, Memo = t.TeamMemo, Image = t.TeamPic }).ToList();
                    totalItems = filterTeam.Count();
                    totalPages = (int)Math.Ceiling((double)totalItems / pageSize);
                    cards = filterTeam.Skip((model.Page - 1) * pageSize).Take(pageSize).ToList();
                    HttpContext.Session.SetString("filterTeam", JsonConvert.SerializeObject(filterTeam));
                    HttpContext.Session.SetInt32("totalItems", totalItems);
                    HttpContext.Session.SetInt32("totalPages", totalPages);
                    return Json(new { cards, totalPages, totalItems });
                }

                // 只選擇位置時
                else if (model.MatchRole.Count() > 0)
                {
                    filterTeam = (from t in _context.Teams
                                  join r in _context.Roles
                                  on t.RoleId equals r.RoleId
                                  join e in _context.Events
                                  on t.EventId equals e.EventId
                                  where t.SportId == SportType && t.GenderId == UserInfoForSuggest[0].GenderId && model.MatchRole.Contains(r.RoleName)
                                  select new SelectViewModel { TeamID = t.TeamId, Name = t.TeamName, Role = r.RoleName, Memo = t.TeamMemo, Image = t.TeamPic }).ToList();
                    totalItems = filterTeam.Count();
                    totalPages = (int)Math.Ceiling((double)totalItems / pageSize);
                    cards = filterTeam.Skip((model.Page - 1) * pageSize).Take(pageSize).ToList();
                    HttpContext.Session.SetString("filterTeam", JsonConvert.SerializeObject(filterTeam));
                    HttpContext.Session.SetInt32("totalItems", totalItems);
                    HttpContext.Session.SetInt32("totalPages", totalPages);
                    return Json(new { cards, totalPages, totalItems });
                }
                // 當選擇賽事時
                else if (model.MatchEvent.Count() > 0)
                {
                    filterTeam = (from t in _context.Teams
                                  join r in _context.Roles
                                  on t.RoleId equals r.RoleId
                                  join e in _context.Events
                                  on t.EventId equals e.EventId
                                  where t.SportId == SportType && t.GenderId == UserInfoForSuggest[0].GenderId && model.MatchEvent.Contains(e.EventName)
                                  select new SelectViewModel { TeamID = t.TeamId, Name = t.TeamName, Role = r.RoleName, Memo = t.TeamMemo, Image = t.TeamPic }).ToList();
                    totalItems = filterTeam.Count();
                    totalPages = (int)Math.Ceiling((double)totalItems / pageSize);
                    cards = filterTeam.Skip((model.Page - 1) * pageSize).Take(pageSize).ToList();
                    HttpContext.Session.SetString("filterTeam", JsonConvert.SerializeObject(filterTeam));
                    HttpContext.Session.SetInt32("totalItems", totalItems);
                    HttpContext.Session.SetInt32("totalPages", totalPages);
                    return Json(new { cards, totalPages, totalItems });
                }
                return Json(new { cards, totalPages, totalItems });
            }
        }

        // 獲得切換下一頁後的資料
        [HttpGet]
        public JsonResult GetSelectionNextPage(int page, int pageSize = 6)
        {
            List<SelectViewModel>? data;
            var filterTeam = HttpContext.Session.GetString("filterTeam");
            var filterPlayer = HttpContext.Session.GetString("filterPlayer");
            if (filterTeam != null)
            {
                data = JsonConvert.DeserializeObject<List<SelectViewModel>>(filterTeam);
            }
            else
            {
                data = JsonConvert.DeserializeObject<List<SelectViewModel>>(filterPlayer);
            }

            int? totalItems = HttpContext.Session.GetInt32("totalItems");
            int? totalPages = HttpContext.Session.GetInt32("totalPages");
            var cards = data.ToList().Skip((page - 1) * pageSize).Take(pageSize).ToList();
            return Json(new { cards, totalPages, totalItems });

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

        // 送出申請/招募事件
        [HttpPost]
        public async Task<IActionResult> ApplyTask(string applyName, string applyNote, string applyType)
        {
            // 取得目前使用者資料
            string UserInfo = HttpContext.Session.GetString("UserInfo")!; // 從 Session 取出
            var UserInfoForSuggest = (from u in _context.Users
                                      join t in _context.Teams
                                      on u.UserId equals t.UserId
                                      where u.Email.ToString().ToLower() == UserInfo.ToLower()
                                      select new { u.UserId, t.TeamId }).ToList();

            Apply tmp = new Apply();
            switch (applyType)
            {
                case "申請確認":
                    var TeamInfo = (from t in _context.Teams where t.TeamName == applyName select t.TeamId).ToList();
                    var CheckTeam = (from a in _context.Applies where a.UserId == UserInfoForSuggest[0].UserId && a.TeamId == TeamInfo[0] select a).ToList();
                    if (CheckTeam.Count() != 0)
                    {
                        return Json(new { success = false, message = "資料已存在" });
                    }

                    tmp.UserId = UserInfoForSuggest[0].UserId;
                    tmp.TeamId = TeamInfo[0];
                    tmp.Memo = applyNote;
                    tmp.Status = "申請中";
                    tmp.Type = "找隊伍";
                    _context.Add(tmp);
                    await _context.SaveChangesAsync();
                    return Json(new { success = true, message = "資料已儲存" });
                case "招募確認":
                    var PlayerInfo = (from u in _context.Users where u.Name == applyName select u.UserId).ToList();
                    var CheckPlayer = (from a in _context.Applies where a.UserId == PlayerInfo[0] && a.TeamId == UserInfoForSuggest[0].TeamId select a).ToList();
                    if (CheckPlayer.Count() != 0)
                    {
                        return Json(new { success = false, message = "資料已存在" });
                    }

                    tmp.UserId = PlayerInfo[0];
                    tmp.TeamId = UserInfoForSuggest[0].TeamId;
                    tmp.Memo = applyNote;
                    tmp.Status = "申請中";
                    tmp.Type = "找隊友";
                    _context.Add(tmp);
                    await _context.SaveChangesAsync();
                    return Json(new { success = true, message = "資料已儲存" });

                default:
                    break;
            }
            return View("MatchPage");
        }

        // 
        public JsonResult GetHistory()
        {
            // 取得目前使用者資料
            string UserInfo = HttpContext.Session.GetString("UserInfo")!; // 從 Session 取出
            var UserInfoForSuggest = (from u in _context.Users
                                      join t in _context.Teams
                                      on u.UserId equals t.UserId
                                      where u.Email.ToString().ToLower() == UserInfo.ToLower()
                                      select new { u.UserId, t.TeamId }).ToList();



            var HistroyTeam = (from a in _context.Applies
                               join t in _context.Teams
                               on a.TeamId equals t.TeamId
                               where a.UserId == UserInfoForSuggest[0].UserId && a.Status == "申請中"
                               select new { Name = t.TeamName, Type = a.Type }).ToList();

            var HistoryPlayer = (from a in _context.Applies
                                 join u in _context.Users
                                 on a.UserId equals u.UserId 
                                 where a.TeamId == UserInfoForSuggest[0].TeamId && a.Status == "申請中"
                                 select new { Name = u.Name, Type = a.Type }).ToList();

            var TotalHistory = HistroyTeam.Concat(HistoryPlayer).ToList();

            return Json(TotalHistory);
        }
    }
}
