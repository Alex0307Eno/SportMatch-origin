using System;
using System.Collections.Generic;

namespace SportMatch.Models;

public partial class ProductCategoryMapping
{
    public int MappingKeyId { get; set; }

    public int ProductId { get; set; }

    public int CategoryId { get; set; }

    public int SubCategoryId { get; set; }

    public virtual ProducCategory Category { get; set; } = null!;

    public virtual Product Product { get; set; } = null!;

    public virtual ProductSubCategory SubCategory { get; set; } = null!;
}
