using System;
using System.Collections.Generic;

namespace SportMatch.Models;

public partial class ProducCategory
{
    public int CategoryId { get; set; }

    public string CategoryName { get; set; } = null!;

    public virtual ICollection<ProductCategoryMapping> ProductCategoryMappings { get; set; } = new List<ProductCategoryMapping>();
}
