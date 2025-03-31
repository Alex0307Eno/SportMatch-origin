using System;
namespace SportMatch.Models
{
    public class FilterViewModel
    {
        public string? SportType { get; set; }
        public string? DateRange { get; set; }
        public string? EventGroup { get; set; }
        public string? Gender { get; set; }
        public string? Area { get; set; }
        public int Page { get; set; } = 1;
    }
    public class FilterResultViewModel
    {
        public List<EventPageModel> Events { get; set; } = new();
        public int TotalCount { get; set; }
        public int CurrentPage { get; set; }
        public int PageSize { get; set; } = 5;
    }
    public class EventPageModel
    {
        public int EventID { get; set; }
        public string? EventName { get; set; }
        public DateTime EventDate { get; set; }
        public string EventLocation { get; set; } = null!;
        public int GenderId { get; set; }
        public int EventGroupID { get; set; }
        public string EventPic { get; set; } = null!;
        public int SportID { get; set; }
        public int AreaID { get; set; }
        public int? Award { get; set; }
        public int EventQuota { get; set; }
        public int? JoinPeople { get; set; }
    }
}
