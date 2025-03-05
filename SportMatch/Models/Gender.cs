using System;
using System.Collections.Generic;

namespace SportMatch.Models;

public partial class Gender
{
    public int GenderId { get; set; }

    public string GenderType { get; set; } = null!;

    public virtual ICollection<Event> Events { get; set; } = new List<Event>();

    public virtual ICollection<Team> Teams { get; set; } = new List<Team>();

    public virtual ICollection<User> Users { get; set; } = new List<User>();
}
