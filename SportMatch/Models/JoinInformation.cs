using System;
using System.Collections.Generic;

namespace SportMatch.Models;

public partial class JoinInformation
{
    public int JoinId { get; set; }

    public int EventId { get; set; }

    public int UserId { get; set; }

    public DateTime JoinDate { get; set; }

    public int TeamId { get; set; }

    public virtual Event Event { get; set; } = null!;

    public virtual Team Team { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
