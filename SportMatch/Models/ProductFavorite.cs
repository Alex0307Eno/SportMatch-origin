using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SportMatch.Models;

public partial class ProductFavorite
{
    [Key]    
    public int ProductFavoriteID { get; set; }

    public int ProductID { get; set; }

    public int UserID { get; set; }
}
//250320新增