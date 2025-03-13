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

namespace SportMatch.Controllers
{
    public class AccountController : Controller
    {
        // private readonly SportMatchContext _context;
        private readonly IConfiguration _configuration;
        private readonly MyDbContext _context;
        


        // public AccountController(SportMatchContext context, IConfiguration configuration)
        // {
        //     _context = context;
        //     _configuration = configuration;
        //    
        //
        // }
        
        public AccountController(MyDbContext context, IConfiguration configuration)
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

       

        // 發送臨時密碼的 API
        [HttpPost]
        [Route("ForgotPassword/SendTempPassword")]
        public IActionResult SendTempPassword([FromBody] EmailModel model)
        {
            if (model == null || string.IsNullOrEmpty(model.Email))
            {
                return BadRequest(new { success = false, message = "電子郵件不可為空" });
            }

            // 檢查電子郵件是否已註冊
            var existingUser = _context.User.FirstOrDefault(u => u.Email == model.Email);
            if (existingUser == null)
            {
                return BadRequest(new { success = false, message = "找不到該電子郵件地址。" });
            }

            // 生成一個臨時密碼
            string tempPassword = GenerateTempPassword();

            // ✅ 加密臨時密碼並存入資料庫
            existingUser.Password = BCrypt.Net.BCrypt.HashPassword(tempPassword);
            _context.SaveChanges();

            
            // 這裡可以選擇發送電子郵件
            bool isSent = SendEmail(model.Email, "您的驗證碼", $"您的驗證碼是：{tempPassword},請盡快修改密碼");

            if (!isSent)
            {
                return StatusCode(500, new { success = false, message = "電子郵件發送失敗，請稍後再試。" });
            }

            return Ok(new { success = true, tempPassword = tempPassword });
        }



        // 生成臨時密碼的邏輯
        // 使用 RandomNumberGenerator 來生成臨時密碼
        private string GenerateTempPassword()
        {
            using (var rng = RandomNumberGenerator.Create())
            {
                byte[] buffer = new byte[8]; // 8 bytes 產生一個16進制的隨機數字
                rng.GetBytes(buffer);
                return BitConverter.ToString(buffer).Replace("-", "").ToLower(); // 轉換為小寫字母
            }
        }


        // 登入接口
        [HttpPost("Login")]
        public IActionResult Login([FromBody] LoginModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { success = false, message = "登入資料不正確" });
            }

            var user = _context.User.FirstOrDefault(u => u.Email == model.Email);

            // if (user == null || !BCrypt.Net.BCrypt.Verify(model.Password, user.Password))
            // {
            //     return BadRequest(new { success = false, message = "帳號或密碼錯誤" });
            // }
            
            HttpContext.Session.SetString("LoggedInEmail", user.Email);

            return Ok(new { success = true, message = "登入成功" });
        }


        // 驗證用戶帳號與密碼
        private bool ValidateUser(string email, string password)
        {
            var user = _context.User.FirstOrDefault(u => u.Email == email);

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
            var existingUser = _context.User.FirstOrDefault(u => u.Email == model.Email);
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

        // 註冊接口
        [HttpPost]
        public IActionResult Register([FromBody] RegisterModel model)
        {
            if (ModelState.IsValid)
            {
                // 檢查郵箱是否已註冊
                var existingUser = _context.User.FirstOrDefault(u => u.Email == model.Email);
                if (existingUser != null)
                {
                    return BadRequest(new { success = false, message = "該郵箱已被註冊" });
                }

                // 檢查驗證碼是否正確
                if (!VerifyVerificationCode(model.VerificationCode!))
                {
                    return BadRequest(new { success = false, message = "驗證碼不正確，請重新發送驗證碼" });
                }

                // 密碼加密
                var hashedPassword = BCrypt.Net.BCrypt.HashPassword(model.Password);

                // 創建新用戶
                var user = new User
                {
                    RoleId = 1, // 設置角色為用戶
                    UserName = model.UserName,
                    Email = model.Email,
                    Password = hashedPassword, // 存儲加密後的密碼
                    CreatedAt = DateTime.Now
                };

                _context.User.Add(user);
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
        public string?  VerificationCode { get; set; } // 驗證碼
    }
    public class ResetPasswordModel
    {
        public string? Email { get; set; }  // 用戶的電子郵件
        public string? VerificationCode { get; set; }  // 驗證碼
        public string? NewPassword { get; set; }  // 新密碼
        public string? ConfirmPassword { get; set; }  // 確認新密碼
    }
    


}
