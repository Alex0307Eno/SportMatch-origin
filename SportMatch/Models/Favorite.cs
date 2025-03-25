using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SportMatch.Models;

public partial class Favorite
{
    [Key]
    public int FavoriteID { get; set; }

    public int UserID { get; set; }

    public string Type { get; set; }

    public int MyFavorite { get; set; }
}
