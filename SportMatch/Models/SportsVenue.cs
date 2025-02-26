using System;
using System.Collections.Generic;

namespace SportMatch.Models;

public partial class SportsVenue
{
    public int VenueId { get; set; }

    public string VenueName { get; set; } = null!;

    public string? Description { get; set; }

    public int SportId { get; set; }

    public string Address { get; set; } = null!;

    public string? Facilities { get; set; }

    public string Phone { get; set; } = null!;

    public string ContactLineId { get; set; } = null!;

    public string? ContactWebsite { get; set; }

    public virtual Sport Sport { get; set; } = null!;

    public virtual ICollection<VenueImage> VenueImages { get; set; } = new List<VenueImage>();
}
