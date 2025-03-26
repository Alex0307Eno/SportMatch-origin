using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Drawing.Printing;
using System;


namespace SportMatch.Models
{
    public class SelectViewModel
    {
        public int TeamID { get; set; }
        public int UserID { get; set; }
        public string? Name { get; set; }
        public string? Role { get; set; }
        public int RoleID { get; set; }
        public int SportID { get; set; }
        public string? Memo { get; set; }
        public string? Image { get; set; }

        public User? User { get; set; }       

    }
}
