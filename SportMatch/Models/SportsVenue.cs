using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SportMatch.Models;

public partial class SportsVenue
{
    [Key]
    public int VenueId { get; set; }

    public string VenueName { get; set; } = null!;

    public string? Description { get; set; }

    public int SportId { get; set; }
    
    public string? City { get; set; }
    
    public string Address { get; set; } = null!;

    public string? Facilities { get; set; }

    public string Phone { get; set; } = null!;

    public string ContactLineId { get; set; } = null!;

    public string? ContactWebsite { get; set; }
    
    public int? Price { get; set; }

    public virtual ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();

    public virtual ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();

    public virtual Sport Sport { get; set; } = null!;

    public virtual ICollection<VenueFee> VenueFees { get; set; } = new List<VenueFee>();

    public virtual ICollection<VenueImage> VenueImages { get; set; } = new List<VenueImage>();
}
