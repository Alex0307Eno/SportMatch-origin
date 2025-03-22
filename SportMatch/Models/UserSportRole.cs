using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SportMatch.Models;

public class UserSportRole
{
    [Key]
    public int UserId { get; set; }
    public int SportId { get; set; } 
    public int RoleId { get; set; }
    
    [ForeignKey("UserId")]
    public virtual User User { get; set; } = null!;
    
    [ForeignKey("SportId")]
    public virtual Sport Sport { get; set; } = null!;
    
    [ForeignKey("RoleId")]
    public virtual Role Role { get; set; } = null!;
}