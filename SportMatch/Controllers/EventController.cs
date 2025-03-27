using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using SportMatch.Models;

namespace SportMatch.Controllers
{
    public class EventController : Controller
    {
        private readonly SportMatchV1Context _context;
        public EventController(SportMatchV1Context context)
        {
            _context = context;
        }
        public IActionResult EventPage()
        {
            var countdowns = _context.Events
            .Select(e => new EventPageModel
             {
                 EventID = e.EventId,
                 EventName = e.EventName,
                 EventDate = e.EventDate,
                 EventLocation = e.EventLocation,
                 GenderId = e.GenderId,
                 EventGroupID = e.EventGroupId,
                 EventPic = e.EventPic,
                 SportID = e.SportId,
                 AreaID = e.AreaId,
                 Award = e.Award,
                 EventQuota = e.EventQuota,
                 JoinPeople = e.JoinPeople,
             })
        .ToList();
            return View(countdowns);
        }

        public IActionResult JoinPage()
        {
            return View();
        }
    }
}
