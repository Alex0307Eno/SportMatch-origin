using System;
using System.Collections.Generic;

namespace SportMatch.Models;

public partial class Team
{
    public int TeamId { get; set; }

    public string TeamName { get; set; } = null!;

    public int SportId { get; set; }

    public string? TeamPic { get; set; }

    public string? TeamMemo { get; set; }

    public int UserId { get; set; }

    public DateTime CreateTime { get; set; }

    public int? RoleId { get; set; }

    public int? GenderId { get; set; }

    public int? AreaId { get; set; }

    public int? EventId { get; set; }

    public virtual ICollection<Apply> Applies { get; set; } = new List<Apply>();

    public virtual Area? Area { get; set; }

    public virtual Event? Event { get; set; }

    public virtual Gender? Gender { get; set; }

    public virtual ICollection<JoinInformation> JoinInformations { get; set; } = new List<JoinInformation>();

    public virtual Role? Role { get; set; }

    public virtual Sport Sport { get; set; } = null!;

    public virtual ICollection<TeamMemberMapping> TeamMemberMappingTeamIdLeaderNavigations { get; set; }

    public virtual ICollection<TeamMemberMapping> TeamMemberMappingTeamIdMemberNavigations { get; set; } = new List<TeamMemberMapping>();

    public virtual User User { get; set; } = null!;
}
