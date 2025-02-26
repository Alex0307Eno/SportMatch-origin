using System;
using System.Collections.Generic;

namespace SportMatch.Models;

public partial class ProductCategoryMapping
{
    public int ProductId { get; set; }

    public int CategoryId { get; set; }

    public virtual ProducCategory Category { get; set; } = null!;

    public virtual Product Product { get; set; } = null!;
}
