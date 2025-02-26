using System;
using System.Collections.Generic;

namespace SportMatch.Models;

public partial class Pay
{
    public int PayStatusId { get; set; }

    public string PayStatusNumber { get; set; } = null!;

    public int TeamId { get; set; }

    public DateTime PayDate { get; set; }

    public string PayStatus { get; set; } = null!;

    public virtual Team Team { get; set; } = null!;
}
