using System;
using System.Collections.Generic;

namespace SportMatch.Models;

public partial class Area
{
    public int AreaId { get; set; }

    public string AreaName { get; set; } = null!;

    public virtual ICollection<Event> Events { get; set; } = new List<Event>();

    public virtual ICollection<Team> Teams { get; set; } = new List<Team>();

    public virtual ICollection<UserDatum> UserData { get; set; } = new List<UserDatum>();
}
