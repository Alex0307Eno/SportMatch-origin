using System;
using System.Collections.Generic;

namespace SportMatch.Models;

public partial class TeamRecruitment
{
    public int TeamHireId { get; set; }

    public int TeamId { get; set; }

    public int RoleId { get; set; }

    public virtual Role Role { get; set; } = null!;

    public virtual Team Team { get; set; } = null!;
}
