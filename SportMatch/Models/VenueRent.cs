using System;
using System.Collections.Generic;

namespace SportMatch.Models;

public partial class VenueRent
{
    public int RentId { get; set; }

    public int UserId { get; set; }

    public DateTime RentTime { get; set; }

    public int VenueFeeId { get; set; }

    public virtual User User { get; set; } = null!;

    public virtual VenueFee VenueFee { get; set; } = null!;
}
