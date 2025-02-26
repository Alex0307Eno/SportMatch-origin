using System;
using System.Collections.Generic;

namespace SportMatch.Models;

public class RegisterModel
{
    public string? UserName { get; set; }
    public string? Email { get; set; }
    public string? VerificationCode { get; set; }  // 若有使用驗證碼
    public string? Password { get; set; }
    public string? ConfirmPassword { get; set; }
}
