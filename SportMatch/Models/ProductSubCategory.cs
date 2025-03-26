using System;
using System.Collections.Generic;

namespace SportMatch.Models;

public partial class ProductSubCategory
{
    public int SubCategoryId { get; set; }

    public string SubCategoryName { get; set; } = null!;

    public virtual ICollection<ProductCategoryMapping> ProductCategoryMappings { get; set; } = new List<ProductCategoryMapping>();
}
