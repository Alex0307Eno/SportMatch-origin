using System;
namespace SportMatch.Models
{
    public class EventPageModel
    {
        public int Id { get; set; }
        public DateTime EventDate { get; set; }
        public string? Description { get; set; }
    }
}
