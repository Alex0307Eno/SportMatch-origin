using System;
namespace SportMatch.Models
{
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
