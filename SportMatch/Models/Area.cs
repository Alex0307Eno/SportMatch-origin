using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SportMatch.Models;

public partial class Area
{
    [Key]
    public int AreaId { get; set; }

    public string AreaName { get; set; } = null!;

    public virtual ICollection<Event> Events { get; set; } = new List<Event>();

    public virtual ICollection<Team> Teams { get; set; } = new List<Team>();

    public virtual ICollection<User> Users { get; set; } = new List<User>();
}
