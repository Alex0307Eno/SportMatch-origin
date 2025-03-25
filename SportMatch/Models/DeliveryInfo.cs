using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SportMatch.Models;

public partial class DeliveryInfo
{
    [Key]
    public int DeliveryInfoID { get; set; }

    public string Address { get; set; }

    public string Recepient { get; set; }

    public string Phone { get; set; }

    public int UserID { get; set; }
}
