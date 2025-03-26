using System;
using System.Collections.Generic;

namespace SportMatch.Models;

public partial class TeamMemberMapping
{
    public int MappingId { get; set; }

    public int UserId { get; set; }

    public int? TeamIdLeader { get; set; }

    public int? TeamIdMember { get; set; }

    public int SportId { get; set; }

    public DateTime JoinTime { get; set; }

    public virtual Sport Sport { get; set; } = null!;

    public virtual Team? TeamIdLeaderNavigation { get; set; }

    public virtual Team? TeamIdMemberNavigation { get; set; }

    public virtual User User { get; set; } = null!;
}
