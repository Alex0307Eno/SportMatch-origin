using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SportMatch.Models;

public partial class ProductSubCategory
{
    [Key]
    [Column("SubCategoryId")]
    public int SubCategoryID { get; set; }

    public string? SubCategoryName { get; set; }

    //public virtual ICollection<ProductCategoryMapping> ProductCategoryMappings { get; set; } = new List<ProductCategoryMapping>();
}
