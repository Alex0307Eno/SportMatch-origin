using Microsoft.AspNetCore.Mvc;
using SportMatch.Models;
using System.Linq;
using System;
using Microsoft.Extensions.Configuration;
using System.Net;
using System.Net.Mail;
using System.Security.Cryptography;
using System.Web;
using System.Text.Json.Nodes;
using System.Net.Http.Headers;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using System.Security.Principal;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Identity;

namespace SportMatch.Controllers
{

    public class AccountController : Controller
    {
        private readonly SportMatchV1Context _context;
        private readonly IConfiguration _configuration;



        public AccountController(SportMatchV1Context context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;



        }


        // 註冊頁面
        [HttpGet]
        public IActionResult Register()
        {
            return View(); // 返回註冊視圖
        }

        // 忘記密碼頁面
        [HttpGet]
        public IActionResult ForgotPassword()
        {
            return View(); // 返回忘記密碼視圖
        }

        // 發送忘記密碼驗證碼
        [HttpPost]
        public IActionResult SendForgotPasswordVerificationCode([FromBody] EmailModel model)
        {
            if (string.IsNullOrEmpty(model.Email))
            {
                return BadRequest(new { success = false, message = "電子郵件不可為空" });
            }

            // 檢查電子郵件是否已註冊
            var existingUser = _context.Users.FirstOrDefault(u => u.Email == model.Email);
            if (existingUser == null)
            {
                return BadRequest(new { success = false, message = "找不到該電子郵件地址" });
            }

            // 生成忘記密碼驗證碼
            var verificationCode = GenerateVerificationCode();

            // 儲存驗證碼和電子郵件到 TempData
            TempData["VerificationCode"] = verificationCode;
            TempData["Email"] = model.Email;
            TempData["LastSentTime"] = DateTime.Now;
            //250318新增用console直接查看驗證碼
            Console.WriteLine(verificationCode);

            // 發送電子郵件
            bool isSent = SendEmail(model.Email, "您的忘記密碼驗證碼", $"您的驗證碼是：{verificationCode}，請在10分鐘內使用此驗證碼重設您的密碼。");

            if (isSent)
            {
                return Ok(new { success = true, message = "驗證碼已發送" });
            }
            else
            {
                return BadRequest(new { success = false, message = "發送驗證碼失敗" });
            }
        }


        // 驗證忘記密碼驗證碼
        [HttpPost]
        public IActionResult VerifyForgotPasswordVerificationCode([FromBody] VerificationModel model)
        {
            // 從 TempData 取得儲存的驗證碼
            var storedVerificationCode = TempData["VerificationCode"] as string;
            var storedEmail = TempData["Email"] as string;
            var lastSentTime = TempData["LastSentTime"] as DateTime?;

            // 檢查驗證碼是否有效
            if (string.IsNullOrEmpty(storedVerificationCode))
            {
                return BadRequest(new { success = false, message = "驗證碼已過期或無效，請重新發送" });
            }

            // 檢查驗證碼是否正確
            if (storedVerificationCode != model.VerificationCode)
            {
                return BadRequest(new { success = false, message = "驗證碼錯誤，請重新發送" });
            }

            // 檢查驗證碼是否過期（假設過期時間為 10 分鐘）
            if (lastSentTime.HasValue && DateTime.Now.Subtract(lastSentTime.Value).TotalMinutes > 10)
            {
                return BadRequest(new { success = false, message = "驗證碼已過期，請重新發送" });
            }

            return Ok(new { success = true, message = "驗證碼正確" });
        }
        [HttpPost]
        public IActionResult ResetPassword([FromBody] ResetPasswordModel model)
        {
            // 從資料庫中查詢用戶
            var user = _context.Users.FirstOrDefault(u => u.Email == model.Email);
            if (user == null)
            {
                return BadRequest(new { success = false, message = "找不到該用戶" });
            }

            // 更新密碼
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(model.NewPassword);
            user.Password = hashedPassword;  // 更新密碼欄位

            // 保存變更
            _context.SaveChanges();
            return Ok(new { success = true, message = "密碼已成功更新", redirectUrl = "/" });
        }





        [HttpPost]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { success = false, message = "登入資料不正確" });
            }

            // 查找使用者
            var user = _context.Users.FirstOrDefault(u => u.Email == model.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(model.Password, user.Password))
            {
                return BadRequest(new { success = false, message = "帳號或密碼錯誤" });
            }

            // 判斷身份
            string role = user.Identity switch
            {
                1 => "member",
                2 => "vendor",
                3 => "admin",
                _ => "member" // 預設為會員
            };

            var claims = new List<Claim>
    {
        new Claim(ClaimTypes.Name, user.Email),
        new Claim(ClaimTypes.Role, role),
    };

            var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            var principal = new ClaimsPrincipal(identity);

            // 設定認證 Cookie
            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal);

            // 返回角色信息
            return Ok(new { success = true, message = "登入成功", role = role });
        }
        [HttpPost]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return RedirectToAction("Index", "Home");

        }



        [HttpPost]
        [Authorize(Roles = "Admin")] // 限制只有管理員能操作
        public IActionResult UpdateUserRole(int userId, int newIdentity)
        {
            var user = _context.Users.FirstOrDefault(u => u.UserId == userId);
            if (user == null)
            {
                return NotFound(new { success = false, message = "用戶不存在" });
            }

            if (newIdentity != 1 && newIdentity != 2)
            {
                return BadRequest(new { success = false, message = "無效的身份類型" });
            }

            user.Identity = newIdentity;
            _context.SaveChanges();

            return Ok(new { success = true, message = "用戶身份更新成功" });
        }






        // 驗證用戶帳號與密碼
        private bool ValidateUser(string email, string password)
        {
            var user = _context.Users.FirstOrDefault(u => u.Email == email);

            if (user == null)
            {
                return false; // 用戶不存在，直接返回 false
            }

            // 使用 BCrypt 驗證密碼
            return BCrypt.Net.BCrypt.Verify(password, user.Password);
        }




        // 註冊發送驗證碼接口
        [HttpPost]
        public IActionResult SendVerificationCode([FromBody] EmailModel model)
        {
            if (string.IsNullOrEmpty(model.Email))
            {
                return BadRequest(new { success = false, message = "電子郵件不可為空" });
            }

            // 檢查電子郵件是否已註冊
            var existingUser = _context.Users.FirstOrDefault(u => u.Email == model.Email);
            if (existingUser != null)
            {
                return BadRequest(new { success = false, message = "此電子郵件已註冊" });
            }

            // 生成註冊驗證碼
            var verificationCode = GenerateVerificationCode();

            // 儲存註冊驗證碼及電子郵件
            TempData["VerificationCode"] = verificationCode;
            TempData["Email"] = model.Email;
            TempData["LastSentTime"] = DateTime.Now;
            //250318用console直接查看驗證碼
            Console.WriteLine(verificationCode);

            // 發送電子郵件
            bool isSent = SendEmail(model.Email, "您的驗證碼", $"您的驗證碼是：{verificationCode}");

            if (isSent)
            {
                return Ok(new { success = true, message = "驗證碼已發送" });
            }
            else
            {
                return BadRequest(new { success = false, message = "發送驗證碼失敗" });
            }
        }



        // 驗證註冊用戶的驗證碼
        [HttpPost]
        public IActionResult VerifyEmail([FromBody] VerificationModel model)
        {
            // 驗證碼是否正確
            if (!VerifyVerificationCode(model.VerificationCode!))
            {
                return BadRequest(new { success = false, message = "驗證碼錯誤，請重新發送驗證碼" });
            }

            // 驗證成功
            return Ok(new { success = true, message = "驗證成功" });
        }

        [HttpGet]
        [Route("CheckUsername")]
        public async Task<IActionResult> CheckUsername(string username)
        {
            if (string.IsNullOrWhiteSpace(username))
            {
                return BadRequest(new { available = false, message = "使用者名稱不能為空！" });
            }

            bool exists = await _context.Users.AnyAsync(u => u.UserName == username);
            return Ok(new { available = !exists });
        }


        // 註冊接口
        [HttpPost]
        public IActionResult Register([FromBody] RegisterModel model)
        {
            if (ModelState.IsValid)
            {
                // 檢查 UserName 是否已經存在
                var existingUser = _context.Users.FirstOrDefault(u => u.UserName == model.UserName);

                if (existingUser != null)
                {
                    return BadRequest(new { success = false, message = "使用者名稱已被使用，請換一個！" });
                }
                // 檢查郵箱是否已註冊
                var existingEmail = _context.Users.FirstOrDefault(u => u.Email == model.Email);
                if (existingUser != null)
                {
                    return BadRequest(new { success = false, message = "該郵箱已被註冊" });
                }


                // 檢查驗證碼是否正確
                if (!VerifyVerificationCode(model.VerificationCode!))
                {
                    return BadRequest(new { success = false, message = "驗證碼不正確，請重新發送驗證碼" });
                }

                // 設定角色
                int userRole = 1; // 預設為用戶

                // 如果有輸入統一編號且長度為 8 位數，則設定為廠商
                if (model.GuiCode.HasValue && model.GuiCode.Value.ToString().Length == 8)
                {
                    userRole = 2; // 廠商
                }

                // 密碼加密
                var hashedPassword = BCrypt.Net.BCrypt.HashPassword(model.Password);

                // 創建新用戶
                var user = new User
                {
                    Identity = userRole, // 設置角色為用戶
                    UserName = model.UserName!,
                    Email = model.Email!,
                    Password = hashedPassword, // 存儲加密後的密碼
                    CreatedAt = DateTime.Now,
                    GuiCode = model.GuiCode // 儲存統一編號

                };

                _context.Users.Add(user);
                _context.SaveChanges();

                return Ok(new { success = true, message = "註冊成功" });
            }

            return BadRequest(new { success = false, message = "註冊資料不正確" });
        }

        // 幫助方法：生成驗證碼（這是一個簡單範例，您可以根據需要改進）
        private string GenerateVerificationCode()
        {
            var random = new Random();
            return random.Next(1000, 9999).ToString();
        }

        // 幫助方法：發送電子郵件
        private bool SendEmail(string toEmail, string subject, string body)
        {
            try
            {
                var smtpClient = new SmtpClient(_configuration["EmailSettings:SMTPHost"])
                {
                    Port = 587,
                    Credentials = new NetworkCredential(_configuration["EmailSettings:SMTPUser"], _configuration["EmailSettings:SMTPPassword"]),
                    EnableSsl = true
                };

                var mailMessage = new MailMessage
                {
                    From = new MailAddress(_configuration["EmailSettings:SMTPUser"]!),
                    Subject = subject,
                    Body = body,
                    IsBodyHtml = true
                };

                mailMessage.To.Add(toEmail);

                smtpClient.Send(mailMessage);
                return true;
            }
            catch (SmtpException smtpEx)
            {
                Console.WriteLine($"SMTP 發送錯誤: {smtpEx.Message}");
                return false;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"發送郵件時出錯: {ex.Message}");
                return false;
            }
        }

        // 驗證驗證碼是否正確
        private bool VerifyVerificationCode(string enteredCode)
        {
            string storedVerificationCode = TempData["VerificationCode"]?.ToString()!;
            return storedVerificationCode == enteredCode;
        }
    }

    // 定義註冊模型
    public class RegisterModel
    {
        public string? UserName { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
        public string? VerificationCode { get; set; } // 驗證碼

        public int? GuiCode { get; set; } // 統一編號
    }

    // 定義登入模型
    public class LoginModel
    {
        public string? Email { get; set; }
        public string? Password { get; set; }
    }

    // 定義電子郵件模型
    public class EmailModel
    {
        public string? Email { get; set; }
    }

    // 定義驗證碼模型
    public class VerificationModel
    {
        public string? VerificationCode { get; set; } // 驗證碼
    }
    public class ResetPasswordModel
    {
        public string? Email { get; set; }  // 用戶的電子郵件
        public string? VerificationCode { get; set; }  // 驗證碼
        public string? NewPassword { get; set; }  // 新密碼
        public string? ConfirmPassword { get; set; }  // 確認新密碼
    }






}
