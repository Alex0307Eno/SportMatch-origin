using System;
using System.Collections.Generic;

namespace SportMatch.Models;

public partial class Role
{
    public int RoleId { get; set; }

    public string RoleName { get; set; } = null!;

    public int SportId { get; set; }

    public virtual Sport Sport { get; set; } = null!;

    public virtual ICollection<TeamRecruitment> TeamRecruitments { get; set; } = new List<TeamRecruitment>();

    public virtual ICollection<UserSportRole> UserSportRoles { get; set; } = new List<UserSportRole>();
}
