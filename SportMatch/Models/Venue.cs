using System.ComponentModel.DataAnnotations;
namespace SportMatch.Models;

public class Venue
{
    [Key]
    public int VenueId { get; set; } 
    public string? VenueName { get; set; }
    public byte?  SportId { get; set; }
    public string? City { get; set; }
    public string? Address { get; set; }
}