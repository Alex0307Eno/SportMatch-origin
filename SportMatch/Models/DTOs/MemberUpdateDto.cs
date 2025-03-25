namespace SportMatch.Models.DTOs;

public class MemberUpdateDto
{
    public string Name { get; set; } 
    public string UserName { get; set; }
    public int GenderId { get; set; } 
    public DateOnly Birthday { get; set; }
    public string Password { get; set; } 
    public string Mobile { get; set; } 
}