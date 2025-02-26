namespace SportMatch.Controllers
{
    public class VerificationCodeService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public VerificationCodeService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        // 生成驗證碼
        public string GenerateVerificationCode()
        {
            var random = new Random();
            return random.Next(1000, 9999).ToString();
        }

        // 儲存驗證碼
        public void SaveVerificationCode(string code)
        {
            _httpContextAccessor.HttpContext.Session.SetString("VerificationCode", code);
        }

        // 取得儲存的驗證碼
        public string GetStoredVerificationCode()
        {
            return _httpContextAccessor.HttpContext.Session.GetString("VerificationCode");
        }

        // 驗證驗證碼
        public bool VerifyVerificationCode(string enteredCode)
        {
            var storedCode = GetStoredVerificationCode();
            return storedCode == enteredCode;
        }
    }
}