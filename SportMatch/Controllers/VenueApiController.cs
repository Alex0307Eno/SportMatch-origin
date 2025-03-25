using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SportMatch.Models;

namespace SportMatch.Controllers;

[Route("api/venues")]
[ApiController]
public class VenueApiController : ControllerBase
{
    // 公有資料庫字串
    // private readonly SportMatchContext _context;
    private readonly SportMatchContext _context;

    public VenueApiController(SportMatchContext context)
    {
        _context = context;
    }

    // 取得所有場地
    [HttpGet]
    public async Task<ActionResult<IEnumerable<object>>> GetVenues()
    {
        var venues = await _context.SportsVenues
            .Include(v => v.Sport)
            .Select(v => new
            {
                v.VenueId,
                v.VenueName,
                v.SportId,
                SportName = v.Sport != null ? v.Sport.SportName : null,
                v.City,
                v.Address,
                v.Price
            })
            .ToListAsync();

        return Ok(venues);
    }

    //取單一場地(彈窗)
    [HttpGet("{id}")]
    public async Task<ActionResult> GetVenueDetail(int id)
    {
        var venue = await _context. SportsVenues
            .Include(v => v.Sport)
            .Where(v => v.VenueId == id)
            .Select(v => new
            {
                v.VenueId,
                v.VenueName,
                v.SportId,
                SportName = v.Sport != null ? v.Sport.SportName : "",
                v.City,
                v.Address
            }).FirstOrDefaultAsync();
        if (venue == null)
        {
            return NotFound();
        }
        return Ok(venue);
    }
    
    // 關鍵字查詢場地API
    [HttpGet("search")]
    public async Task<IActionResult> SearchVenues(
        [FromQuery] string? query,
        [FromQuery] string? city,
        [FromQuery] int? sportType)
    {
        var venues = _context.SportsVenues
            .Include(v => v.Sport)
           .AsNoTracking();
        
        //有關鍵字讓它匹配場地名、城市名、運動種類名
        if (!string.IsNullOrEmpty(query))
        {
            venues = venues.Where(v => 
                (v.VenueName?? "").Contains(query) || 
                (v.City ?? "").Contains(query) ||
                (v.Sport != null && (v.Sport.SportName ?? "").Contains(query))
                ).Distinct();
        }

        if (!string.IsNullOrEmpty(query))
        {
            venues = venues.Where(v =>
                (v.VenueName ?? "").Contains(query) ||
                  (v.City ?? "").Contains(query) ||
                  (v.Sport != null && (v.Sport.SportName ?? "").Contains(query))
                  ).Distinct();
        }

        if (!string.IsNullOrEmpty(city))
        {
            venues = venues.Where(v => city.Contains(v.City));
        }
        
        if (sportType.HasValue)
        {
            venues = venues.Where(v => v.SportId == sportType);
        }
        
        var result = await venues.
            Select(v => new
        {
            v.VenueId,
            v.VenueName,
            v.SportId,
            SportName = v.Sport != null ? v.Sport.SportName : null,
            v.City,
            v.Address,
            v.Price
        }).Distinct()
            .ToListAsync();
        return Ok(result);
    }
    
    //基於search結果進一步過濾or單獨使用
    [HttpPost("filter")]
    public async Task<IActionResult> FilterVenues(
        [FromQuery] List<int>? venueIds,
        [FromQuery] int? minPrice,
        [FromQuery] int? maxPrice,
        [FromQuery] string? facility,
        [FromQuery] string? openingHours)
    {
        var venues = _context.SportsVenues.AsQueryable();
        
        //有場地id時基於search結果進行篩選
        if (venueIds != null && venueIds.Any())
        {
            venues = venues.Where(v => venueIds.Contains(v.VenueId));
        }
        //價格最小值
        if (minPrice.HasValue)
        {
            venues = venues.Where(v => v.Price >= minPrice);
        }
        
        //價格最大值
        if (maxPrice.HasValue)
        {
            venues = venues.Where(v => v.Price <= maxPrice);
        }
        
        //設備
        if (!string.IsNullOrEmpty(facility))
        {
            venues = venues.Where(v => v.Facilities.Contains(facility));
        }
        
        //開放時間 (先略

        var result = await venues.Select(v => new
        {
            v.VenueId,
            v.VenueName,
            v.SportId,
            SportName = v.Sport != null ? v.Sport.SportName : null,
            v.City,
            v.Address,
            v.Price
        }).ToListAsync();
        return Ok(result);
    }
}