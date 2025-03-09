using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SportMatch.Models;

namespace SportMatch.Controllers;

public class VenueController : Controller
{
    
    //private readonly MyDbContext _context;
    //public VenueController(MyDbContext context, ILogger<VenueController> logger)
    //{
    //    _context = context;
    //}

    // GET
    public async Task<IActionResult> Index()
    {
        //var venues = await _context.Venues.ToListAsync();

        return View();
    }


    // public async Task<IActionResult> SearchVenue([FromQuery] string? location, [FromQuery] string? sport)
    // {
    //     var query = _context.Venues.AsQueryable();
    //     
    //     if()
    // }
}