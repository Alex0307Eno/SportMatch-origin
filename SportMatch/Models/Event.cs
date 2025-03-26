using System;
using System.Collections.Generic;

namespace SportMatch.Models;

public partial class Event
{
    public int EventId { get; set; }

    public string EventName { get; set; } = null!;

    public DateTime EventDate { get; set; }

    public string EventLocation { get; set; } = null!;

    public int GenderId { get; set; }

    public int EventGroupId { get; set; }

    public string EventPic { get; set; } = null!;

    public int SportId { get; set; }

    public int AreaId { get; set; }

    public int? Award { get; set; }

    public int EventQuota { get; set; }

    public int? JoinPeople { get; set; }

    public virtual Area Area { get; set; } = null!;

    public virtual EventGroup EventGroup { get; set; } = null!;

    public virtual ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();

    public virtual Gender Gender { get; set; } = null!;

    public virtual ICollection<JoinInformation> JoinInformations { get; set; } = new List<JoinInformation>();

    public virtual Sport Sport { get; set; } = null!;

    public virtual ICollection<Team> Teams { get; set; } = new List<Team>();
}
