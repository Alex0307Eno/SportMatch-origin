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

    [HttpGet("account/{id}")]
    public IActionResult GetAccount(int id)
    {
        var user = _context.Users.Find(id);
        if(user == null)
            return NotFound();
        return Ok(user);
    }
    
    //儲存會員資訊
    [HttpPost("account/save")]
    public IActionResult SaveAccount([FromBody] User user)
    {
        _context.Users.Update(user);
        _context.SaveChanges();
        return Ok(new{success = true});
    }
    
    //取得、儲存、刪除付款
}