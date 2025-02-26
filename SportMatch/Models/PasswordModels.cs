namespace SportMatch.Models
{
    // 忘記密碼請求模型
    public class ForgotPasswordModel
    {
        public string Email { get; set; }
    }

    // 重設密碼請求模型
    public class ResetPasswordModel
    {
        public string Email { get; set; } // 使用者的 Email
        public string Token { get; set; } // 密碼重設 Token
        public string NewPassword { get; set; } // 新密碼
    }
}
