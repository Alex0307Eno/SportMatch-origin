using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SportMatch.Models;

namespace SportMatch.Controllers;

public class SportEventApiController: ControllerBase
{
     private readonly SportMatchV1Context _context;
    //private readonly MyDbContext _context;
    
    public SportEventApiController(SportMatchV1Context context)
    {
        _context = context;
    }
    
    //取得所有運動的所有位置
    [HttpGet("api/sport-roles")]
    public IActionResult GetSportWithRole()
    {
        var sportWithRole = _context.Sports
            .Include( s => s.Roles)
            .Select (sport => new
            {
                SportId = sport.SportId,
                SportName = sport.SportName,
                Role = _context.Roles
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