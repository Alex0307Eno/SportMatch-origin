using System;
using System.Collections.Generic;

namespace SportMatch.Models;

public partial class EventGroup
{
    public int EventGroupId { get; set; }

    public string EventGroupName { get; set; } = null!;

    public virtual ICollection<Event> Events { get; set; } = new List<Event>();
}
