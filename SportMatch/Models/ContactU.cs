using System;
using System.Collections.Generic;

namespace SportMatch.Models;

public partial class ContactU
{
    public int MessageId { get; set; }

    public string Name { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string? Phone { get; set; }

    public string Type { get; set; } = null!;

    public string Title { get; set; } = null!;

    public string Content { get; set; } = null!;

    public DateTime CreatedTime { get; set; }

    public string Status { get; set; } = null!;

    public string? ReplyContent { get; set; }

    public string? ReplyBy { get; set; }

    public DateTime? ReplyTime { get; set; }
}
