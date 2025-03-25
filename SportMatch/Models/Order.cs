using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SportMatch.Models;

public partial class Order
{
    public int OrderId { get; set; }

    public string OrderNumber { get; set; } = null!;

    public int ProductId { get; set; }

    public int UserId { get; set; }

    public int Quantity { get; set; }


    public string Payment { get; set; }

    public int DeliveryInfoID { get; set; }


    public virtual Product Product { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
