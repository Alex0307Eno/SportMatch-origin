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
            int pageSize = 5;
            int currentPage = 1;

            var query = _context.Events.OrderBy(e => e.EventDate);
            int total = query.Count();

            var pagedList = query
                .Skip((currentPage - 1) * pageSize)
                .Take(pageSize)
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

            var result = new FilterResultViewModel
            {
                Events = pagedList,
                TotalCount = total,
                CurrentPage = currentPage,
                PageSize = pageSize
            };

            return View(result);
        }
        [HttpPost]
        public IActionResult FilterEvents(FilterViewModel filter)
        {
            var query = _context.Events.AsQueryable();
            //篩選運動種類
            if (!string.IsNullOrEmpty(filter.SportType) && filter.SportType != "所有運動")
            {
                if (filter.SportType == "籃球") query = query.Where(e => e.SportId == 1);
                else if (filter.SportType == "排球") query = query.Where(e => e.SportId == 2);
                else if(filter.SportType == "羽球") query = query.Where(e => e.SportId == 3);
            }
            //篩選日期
            if (!string.IsNullOrEmpty(filter.DateRange) && filter.DateRange != "比賽日期")
            {
                var now = DateTime.Now;
                if (filter.DateRange == "一周內開始")
                    query = query.Where(e => e.EventDate <= now.AddDays(7));
                else if (filter.DateRange == "一個月內")
                    query = query.Where(e => e.EventDate <= now.AddMonths(1));
                else if (filter.DateRange == "三個月內")
                    query = query.Where(e => e.EventDate <= now.AddMonths(3));
                else if (filter.DateRange == "三個月以上")
                    query = query.Where(e => e.EventDate > now.AddMonths(3));
            }
            //篩選比賽類型
            if (!string.IsNullOrEmpty(filter.EventGroup) && filter.EventGroup !="比賽類型")
            {
                if (filter.EventGroup == "兒童組")
                    query = query.Where(e => e.EventGroupId == 1);
                else if (filter.EventGroup == "青少年組")
                    query = query.Where(e => e.EventGroupId == 2);
                else if (filter.EventGroup == "社會組")
                    query = query.Where(e => e.EventGroupId == 3);
                else if (filter.EventGroup == "長青組")
                    query = query.Where(e => e.EventGroupId == 4);
            }
            //篩選性別類組
            if (!string.IsNullOrEmpty(filter.Gender) && filter.Gender != "性別類組")
            {
                if (filter.Gender == "男子組")
                    query = query.Where(e => e.GenderId == 1);
                if (filter.Gender == "女子組")
                    query = query.Where(e => e.GenderId == 2);
            }
            //篩選地點
            if (!string.IsNullOrEmpty(filter.Area) && filter.Area != "賽事地點")
            {
                if (filter.Area == "北部")
                    query = query.Where(e => e.AreaId == 1);
                if (filter.Area == "中部")
                    query = query.Where(e => e.AreaId == 2);
                if (filter.Area == "南部")
                    query = query.Where(e => e.AreaId == 3);
                if (filter.Area == "東部")
                    query = query.Where(e => e.AreaId == 4);
            }
            
            var total = query.Count();
            int pageSize = 5;

            var pagedList = query
                .OrderBy(e => e.EventDate)
                .Skip((filter.Page - 1) * pageSize)
                .Take(pageSize)
                .Select(e => new EventPageModel {
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

            var result = new FilterResultViewModel
            {
                Events = pagedList,
                TotalCount = total,
                CurrentPage = filter.Page,
                PageSize = pageSize
            };

            return PartialView("~/Views/Event/_EventListPartial.cshtml", result);
        }
        [HttpGet]
        public IActionResult GetAllEventDates()
        {
            var eventDates = _context.Events
                .Where(e => e.EventDate >= DateTime.Today) // 可視需求移除這個條件
                .Select(e => new {
                    date = e.EventDate.ToString("yyyy-MM-dd"),
                    eventName = e.EventName
                })
                .ToList();

            return Json(eventDates);
        }
    }
}
