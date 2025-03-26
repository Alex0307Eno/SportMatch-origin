using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SportMatch.Models;

public partial class Order
{
    [Key]
    public int OrderId { get; set; }

    public string OrderNumber { get; set; }

    public int ProductId { get; set; }

    public int UserId { get; set; }

    public int Quantity { get; set; }

    public string Payment { get; set; }

    public int DeliveryInfoID { get; set; }

}
