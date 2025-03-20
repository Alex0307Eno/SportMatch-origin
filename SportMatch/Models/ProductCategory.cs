using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SportMatch.Models;

public partial class ProductCategory
{
    [Key]
    [Column("CategoryId")]
    public int CategoryID { get; set; }

    public string? CategoryName { get; set; }


    public string? SubCategoryName { get; set; }

    public int? ParentID { get; set; }



    public virtual ICollection<ProductCategoryMapping> ProductCategoryMappings { get; set; } = new List<ProductCategoryMapping>();
}
