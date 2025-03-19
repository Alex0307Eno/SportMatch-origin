using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SportMatch.Models;
using Microsoft.AspNetCore.Http;
using System.Linq;

namespace SportMatch.Controllers
{
    [Authorize]  // 確保使用者登入後才能訪問
    public class BackController : Controller
    {
        private readonly SportMatchContext _context;

        public BackController(SportMatchContext context)
        {
            _context = context;
        }

        // 接收 localStorage 資料並儲存到 Session
        [HttpPost]

        public IActionResult ReceiveLocalStorage([FromBody] string userInfo)
        {
            if (!string.IsNullOrEmpty(userInfo))
            {
                // 存入 Session
                HttpContext.Session.SetString("Email", userInfo);

                // 查詢資料庫中的 UserName
                var user = _context.Users.FirstOrDefault(u => u.Email == userInfo);
                if (user != null)
                {
                    return Json(new { success = true, message = "資料已接收", userName = user.UserName });
                }
            }
            return Json(new { success = false, message = "找不到對應的使用者" });
        }


        // 供應商後台
        public IActionResult vendorBackstage()
        {
            var currentUserEmail = HttpContext.Session.GetString("Email");

            var user = _context.Users.FirstOrDefault(u => u.Email == currentUserEmail);

            if (user != null)
            {
                ViewBag.UserName = user.UserName;
            }

            return View();
        }

        // 管理員後台
        [Authorize(Roles = "admin")]
        public IActionResult adminBackstage()
        {
            var currentUserEmail = HttpContext.Session.GetString("Email");

            var user = _context.Users.FirstOrDefault(u => u.Email == currentUserEmail);

            if (user != null)
            {
                ViewBag.UserName = user.UserName;
            }

            return View();
        }

        // 根據用戶的角色或其他條件來導向後台
        public IActionResult RedirectToBackstage()
        {
            if (User.IsInRole("admin"))
            {
                return RedirectToAction("adminBackstage");
            }
            else if (User.IsInRole("vendor"))
            {
                return RedirectToAction("vendorBackstage");
            }

            return RedirectToAction("Index", "Home");
        }

        [HttpGet]
        public IActionResult GetUsers()
        {
            // 先從資料庫獲取資料
            var users = _context.Users.ToList();

            // 在 C# 轉換 Identity 數值為對應的角色名稱
            var userList = users.Select(u => new
            {
                Identity = ConvertIdentityToRole(u.Identity), // 轉換角色名稱
                UserId = u.UserId,
                Name = u.Name,
                UserName = u.UserName,
                Email = u.Email,
                GuiCode = u.GuiCode,
                CreatedAt = u.CreatedAt.ToString("yyyy-MM-dd") // 格式化日期
            }).ToList();

            return Json(userList);
        }

        // 將 Identity 數字轉換為角色名稱
        private string ConvertIdentityToRole(int identity)
        {
            return identity switch
            {
                1 => "使用者",
                2 => "廠商",
                3 => "管理員",
                _ => "未知角色"
            };
        }


        [HttpDelete]
        public IActionResult DeleteUser(int id)
        {
            var user = _context.Users.FirstOrDefault(u => u.UserId == id);
            if (user == null)
            {
                return Json(new { success = false, message = "找不到該會員" });
            }

            _context.Users.Remove(user);
            _context.SaveChanges();

            return Json(new { success = true });
        }

    }
}
