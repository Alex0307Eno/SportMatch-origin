namespace SportMatch.Models
{
    public class SelectionRequestModel
    {
        public string? MatchType { get; set; }
        public string? MatchCategory { get; set; }
        public List<string>? MatchEvent { get; set; }
        public List<string>? MatchArea { get; set; }
        public List<string>? MatchRole { get; set; }
        public int Page { get; set; }
    }
}
