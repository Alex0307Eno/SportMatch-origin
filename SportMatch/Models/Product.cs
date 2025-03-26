using System;
using System.Collections.Generic;

namespace SportMatch.Models;

public partial class Product
{
    public int ProductId { get; set; }

    public string ProductName { get; set; } = null!;

    public decimal Price { get; set; }

    public int? Discount { get; set; }

    public int Stock { get; set; }

    public string Image01 { get; set; } = null!;

    public string? Image02 { get; set; }

    public string? Image03 { get; set; }

    public string ProductDetails { get; set; } = null!;

    public DateTime ReleaseDate { get; set; }

    public virtual ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();

    public virtual ProductCategoryMapping? ProductCategoryMapping { get; set; }
}
