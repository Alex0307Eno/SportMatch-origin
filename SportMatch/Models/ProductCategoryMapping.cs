using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SportMatch.Models;

public partial class ProductCategoryMapping
{
    [Key]
    public int MappingKeyId { get; set; }

    [Column("ProductId")]
    public int ProductID { get; set; }

    [Column("CategoryId")]
    public int CategoryID { get; set; }

    [Column("SubCategoryId")]
    public int SubCategoryID { get; set; }

    //public virtual ProducCategory Category { get; set; } = null!;

    //public virtual Product Product { get; set; } = null!;
}
