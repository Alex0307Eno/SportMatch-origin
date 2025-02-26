using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SportMatch.Models
{
    public class LoginViewModel
    {
        [Required(ErrorMessage = "Password 是必填的")]
        public string? Email { get; set; }
        [Required(ErrorMessage = "Password 是必填的")]
        public string? Password { get; set; }
        public bool RememberMe { get; set; }  // 記住我選項
    }
}
