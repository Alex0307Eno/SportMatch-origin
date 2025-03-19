using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SportMatch.Models;

public partial class Product
{
    [Key]
    [Column("ProductId")]
    public int ProductID { get; set; }

    [Column("ProductName")]
    public string? Name { get; set; }

    public decimal Price { get; set; }

    public int Discount { get; set; }

    public int Stock { get; set; }

    public string? Image01 { get; set; }

    public string? Image02 { get; set; }

    public string? Image03 { get; set; }

    public string? ProductDetails { get; set; }

    public DateTime ReleaseDate { get; set; }

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();

    //public virtual ProductCategoryMapping? ProductCategoryMapping { get; set; }
}
