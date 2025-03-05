using System;
using System.Collections.Generic;
using BCrypt.Net;   

namespace SportMatch.Models;

public partial class User
{
    public int UserId { get; set; }

    public string? Name { get; set; }

    public string UserName { get; set; } = null!;

    public string Password { get; set; } = null!;

    public int? GenderId { get; set; }

    public DateTime? Birthday { get; set; }

    public string Email { get; set; } = null!;

    public string? Mobile { get; set; }

    public int? SportId { get; set; }

    public int? RoleId { get; set; }

    public int? AreaId { get; set; }

    public string? UserPic { get; set; }

    public string? UserMemo { get; set; }

    public DateTime CreatedAt { get; set; }

    public string Invited { get; set; } = null!;

    public int Identity { get; set; }

    public virtual ICollection<Apply> Applies { get; set; } = new List<Apply>();

    public virtual Area? Area { get; set; }

    public virtual Gender? Gender { get; set; }

    public virtual ICollection<JoinInformation> JoinInformations { get; set; } = new List<JoinInformation>();

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();

    public virtual Role? Role { get; set; }

    public virtual Sport? Sport { get; set; }

    public virtual ICollection<TeamMemberMapping> TeamMemberMappings { get; set; } = new List<TeamMemberMapping>();

    public virtual ICollection<Team> Teams { get; set; } = new List<Team>();
    //設置加密密碼
    public void SetPassword(string password)
    {
        Password = BCrypt.Net.BCrypt.HashPassword(password);
    }

    //驗證密碼
    public bool VerifyPassword(string password)
    {
        return BCrypt.Net.BCrypt.Verify(password, Password);
    }
}

