using System;
using System.Collections.Generic;

namespace SportMatch.Models;

public partial class Favorite
{
    public int FavoriteId { get; set; }

    public int UserId { get; set; }

    public string Type { get; set; } = null!;

    public int MyFavorite { get; set; }

    public virtual Product MyFavorite1 { get; set; } = null!;

    public virtual Team MyFavorite2 { get; set; } = null!;

    public virtual User MyFavorite3 { get; set; } = null!;

    public virtual SportsVenue MyFavorite4 { get; set; } = null!;

    public virtual Event MyFavoriteNavigation { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
