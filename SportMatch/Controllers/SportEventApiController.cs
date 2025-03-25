using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SportMatch.Models;

namespace SportMatch.Controllers;

public class SportEventApiController: ControllerBase
{
    // private readonly SportMatchContext _context;
    private readonly MyDbContext _context;
    
    public SportEventApiController(MyDbContext context)
    {
        _context = context;
    }
    
    //取得所有運動的所有位置
    [HttpGet("api/sport-roles")]
    public IActionResult GetSportWithRole()
    {
        var sportWithRole = _context.Sport
            .Include( s => s.Roles)
            .Select (sport => new
            {
                SportId = sport.SportId,
                SportName = sport.SportName,
                Role = _context.Role
                    .Where(role => role.SportId == sport.SportId)
                    .Select(role => new
                    {
                        RoleId = role.RoleId,
                        RoleName = role.RoleName
                    }).ToList()
            }).ToList();
        return Ok(sportWithRole);
    }
}