using System;
using System.Collections.Generic;

namespace SportMatch.Models;

public partial class VenueImage
{
    public int PicId { get; set; }

    public int VenueId { get; set; }

    public string? Image { get; set; }

    public DateTime? UploadedAt { get; set; }

    public virtual SportsVenue Venue { get; set; } = null!;
}
