using System;
using System.Collections.Generic;

namespace SportMatch.Models;

public partial class VenueFee
{
    public int VenueFeeId { get; set; }

    public int VenueId { get; set; }

    public string VenueArea { get; set; } = null!;

    public string OpenTime { get; set; } = null!;

    public int? VenueFee1 { get; set; }

    public virtual SportsVenue Venue { get; set; } = null!;

    public virtual ICollection<VenueRent> VenueRents { get; set; } = new List<VenueRent>();
}
