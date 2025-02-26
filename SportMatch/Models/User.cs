using System;
using System.Collections.Generic;
using BCrypt.Net;

namespace SportMatch.Models;

public partial class User
{
    public int UID { get; set; }

    public string? UserName { get; set; }

    public string? Email { get; set; }

    public string? Password { get; set; } // 儲存加密後的密碼

    // 設置加密密碼
    public void SetPassword(string plainPassword)
    {
        // 使用 BCrypt 進行加密，並生成最新版本的密碼哈希
        Password = BCrypt.Net.BCrypt.HashPassword(plainPassword);
    }

    // 驗證密碼
    public bool VerifyPassword(string plainPassword)
    {
        try
        {
            return BCrypt.Net.BCrypt.Verify(plainPassword, Password);
        }
        catch (BCrypt.Net.SaltParseException)
        {
            // 捕捉 SaltParseException，如果密碼哈希格式錯誤
            return false;
        }
    }
}
