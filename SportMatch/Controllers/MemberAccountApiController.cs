using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.DotNet.Scaffolding.Shared.Messaging;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using SportMatch.Models;
using SportMatch.Models.DTOs;


namespace SportMatch.Controllers;
[Route("api/membercenter")]
[ApiController]
public class MemberAccountApiController : ControllerBase
{
     private readonly SportMatchContext _context;
    //private readonly MyDbContext _context;

    public MemberAccountApiController(SportMatchContext context)
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
        
        var user = _context.Users.Include(u => u.Area).FirstOrDefault(u => u.Email == email);
        if (user == null) return Unauthorized(new { success = false, message = "用戶不存在" });
        
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
                user.GenderId,
                user.Password,
                user.Invited,
                user.UserMemo,
                user.UserPic,
                user.AreaId,
                AreaName = user.Area != null ? user.Area.AreaName : "未指定",
            }
        });
    }

    //取得會員運動資料 (喜好運動、位置)
    [HttpGet("user-sport")]
    public IActionResult GetUserSport()
    {
        var user = _context.Users.FirstOrDefault(u => u.Email == User.FindFirstValue(ClaimTypes.Name));
        if (user == null) return Unauthorized();

        //var userSports = _context.UserSportRole
        //    .Where(usr => usr.UserId == user.UserId)
        //    .Include(usr => usr.Sport) 
        //    .Include(usr => usr.Role)
        //    .Select(usr => new
        //    {
        //        usr.Sport.SportId,
        //        usr.Sport.SportName,
        //        usr.Role.RoleId,
        //        usr.Role.RoleName
        //    }).ToList();
        
        //return Ok(userSports);
        return Ok(""); // 測試用 要刪掉
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
    
    //更新基本資料
    [HttpPatch("update/userData")]
    public async Task<IActionResult> UpdateMember([FromBody] MemberUpdateDto updateDto)
    {
        try
        {
            var email = User.FindFirstValue(ClaimTypes.Name);
            if (string.IsNullOrEmpty(email))
            {
                return Unauthorized(new { success = false, message = "未登入或登入逾時" });
            }
            
            var member = _context.Users.FirstOrDefault(u => u.Email == email);
            if (member == null)
            {
                return NotFound(new { success = false, message = "會員不存在" });
            }
            
            if (!ModelState.IsValid)
            {
                Console.WriteLine("ModelState 錯誤: " + JsonConvert.SerializeObject(ModelState.Values.SelectMany(v => v.Errors)));
                return BadRequest(new { success = false, message = "請求格式錯誤", errors = ModelState.Values.SelectMany(v => v.Errors) });
            }
            
            member.Name = updateDto.Name;
            member.UserName = updateDto.UserName;
            member.GenderId = updateDto.GenderId;
            member.Birthday = updateDto.Birthday;
            member.Mobile = updateDto.Mobile;

            if (!string.IsNullOrWhiteSpace(updateDto.Password))
            {
                member.Password = BCrypt.Net.BCrypt.HashPassword(updateDto.Password);
            }
            
            _context.Users.Update(member);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "資料更新成功" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message="更新失敗，請稍後再試", error = ex.Message });
        }
    }
    
    //更新運動資料
    // [HttpPatch("update/sportData")]
    // public async Task<IActionResult> UpdateSportData([FromBody] SportUpdateAllDto updateDto)
    // {
    //     await using var transaction = await _context.Database.BeginTransactionAsync();
    //     try
    //     {
    //         var email = User.FindFirstValue(ClaimTypes.Name);
    //         if (string.IsNullOrEmpty(email))
    //         {
    //             return Unauthorized(new {success = false, message = "未登入或登入逾時"});
    //         }
    //     
    //         var member = _context.User.FirstOrDefault(u => u.Email == email);
    //         if (member == null)
    //         {
    //             return NotFound(new { success = false, message = "會員不存在" });
    //         }
    //
    //         member.UserMemo = updateDto.User.UserMemo;
    //         member.AreaId = updateDto.User.AreaId;
    //         member.Invited = updateDto.User.Invited;
    //         _context.User.Update(member);
    //         await _context.SaveChangesAsync();
    //     
    //         //取該會員舊的所有喜好運動紀錄
    //         var existingSports = await _context.UserSportRole.Where(usr => usr.UserId == member.UserId)
    //             .ToListAsync();
    //
    //         foreach (var sport in SportUpdateAllDto.Sport)
    //         {
    //             var existingSport = existingSports.FirstOrDefault(usr => usr.SportId == sport.SportId);
    //             if (existingSport != null)
    //             {
    //                 existingSport.RoleId = sport.RoleId;
    //                 _context.UserSportRole.Update(existingSport);
    //             }
    //             else
    //             {
    //                 //如果運動項目不存在，新增一筆記錄
    //                 var newSport = new UserSportRole
    //                 {
    //                     UserId = member.UserId,
    //                     SportId = sport.SportId,
    //                     RoleId = sport.RoleId
    //                 };
    //                 await _context.UserSportRole.AddAsync(newSport);
    //             }
    //         }
    //         await _context.SaveChangesAsync();
    //         await transaction.CommitAsync();
    //
    //         return Ok(new { success = true, message = "運動資料更新成功" });
    //
    //         return Ok(new { success = true, message = "更新成功" });
    //     }
    //     catch (Exception ex)
    //     {
    //         await transaction.RollbackAsync();
    //         return StatusCode(500, new { success = false, message = "更新失敗，請稍後再試", error = ex.Message });
    //     }
    // }
}