using System;
using System.Collections.Generic;

namespace SportMatch.Models;

public partial class Apply
{
    public int ApplyId { get; set; }

    public int UserId { get; set; }

    public int TeamId { get; set; }

    public string Status { get; set; } = null!;

    public string? Memo { get; set; }

    public virtual Team Team { get; set; } = null!;

    public virtual UserDatum User { get; set; } = null!;
}
