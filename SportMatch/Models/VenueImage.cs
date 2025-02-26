using System;
using System.Collections.Generic;

namespace SportMatch.Models;

public partial class VenueImage
{
    public int PicId { get; set; }

    public int VenueId { get; set; }

    public byte[] Image { get; set; } = null!;

    public DateTime UploadedAt { get; set; }

    public virtual SportsVenue Venue { get; set; } = null!;
}
