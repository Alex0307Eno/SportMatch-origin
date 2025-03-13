using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SportMatch.Models;


namespace SportMatch.Controllers;
[Route("api/membercenter")]
[ApiController]
public class MemberAccountApiController : ControllerBase
{
    // private readonly SportMatchContext _context;
    private readonly MyDbContext _context;

    public MemberAccountApiController(MyDbContext context)
    {
        _context = context;
    }

    [HttpGet("account")]
    [Authorize]
    public IActionResult GetCurrentUser()
    {
        var email = User.FindFirstValue(ClaimTypes.Name); 
        if (string.IsNullOrEmpty(email))
        {
            return Unauthorized(new {success = false, message = "未登入或登入逾時" });
        }
        
        var user = _context.User.FirstOrDefault(u => u.Email == email);
        if (user == null) return Unauthorized(new { success = false, message = "用戶不存在" });
        
        // if (HttpContext.Session.GetString("LoggedInEmail") == null)
        //     return Unauthorized(new {message = "未登入或登入逾時"});
        // var user = _context.User.FirstOrDefault(u => u.Email == HttpContext.Session.GetString("LoggedInEmail"));
        // if (user == null)
        //     return NotFound(new {message = "找不到會員"});
        //
        // Console.WriteLine($"Session 中的 email: {HttpContext.Session.GetString("LoggedInEmail")}");
        //
        // return Ok(user);

        return Ok(new
        {
            ssucess = true,
            user = new
            {
                user.UserId,
                user.Name,
                user.UserName,
                user.Email,
                user.Identity,
                user.CreatedAt,
                user.Mobile,
                user.Birthday,
                // user.Sport
            }
        });
    }
    
    
    
    
    // 測
    [HttpGet("debug/login")]
    public async Task<IActionResult> DebugLogin()
    {
        var Claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, "Chu1020@gmail.com"),
            new Claim(ClaimTypes.Role, "member")
        };
        
        var identity = new ClaimsIdentity(claims: Claims, CookieAuthenticationDefaults.AuthenticationScheme);
        var principal = new ClaimsPrincipal(identity);
        
        await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal);
        
        return Ok(new { success = true, message = "Debug登入成功，跳轉頁面測試！" });
    }
    
    
    
    //取得、儲存、刪除付款
}