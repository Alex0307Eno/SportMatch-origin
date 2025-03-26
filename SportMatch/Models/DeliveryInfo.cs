using System;
using System.Collections.Generic;

namespace SportMatch.Models;

public partial class DeliveryInfo
{
    public int DeliveryInfoId { get; set; }

    public string Address { get; set; } = null!;

    public string Recepient { get; set; } = null!;

    public string Phone { get; set; } = null!;

    public int UserId { get; set; }

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();

    public virtual User User { get; set; } = null!;
}
