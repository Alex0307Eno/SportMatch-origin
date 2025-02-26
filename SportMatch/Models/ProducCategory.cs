using System;
using System.Collections.Generic;

namespace SportMatch.Models;

public partial class ProducCategory
{
    public int CategoryId { get; set; }

    public string CategoryName { get; set; } = null!;

    public string SubCategoryName { get; set; } = null!;

    public int? ParentId { get; set; }

    public virtual ICollection<ProductCategoryMapping> ProductCategoryMappings { get; set; } = new List<ProductCategoryMapping>();
}
