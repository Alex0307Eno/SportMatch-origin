document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("registerForm");
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirm-password");
    const errorMessage = document.getElementById("errorMessage");
    const sendCodeBtn = document.getElementById("sendCodeBtn");
    const emailInput = document.getElementById("email");
    const verificationCodeInput = document.getElementById("verification-code");

    // 強密碼正則表達式
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    // 密碼輸入時進行即時檢查
    password.addEventListener("input", function () {
        if (!strongPasswordRegex.test(password.value)) {
            errorMessage.textContent = "密碼必須至少 8 個字符，包含大小寫字母、數字和特殊符號";
            errorMessage.style.color = "red";
        } else {
            errorMessage.textContent = "";
        }
    });

    // 表單提交處理
    if (form) {
        form.addEventListener("submit", async function (event) {
            event.preventDefault(); // 防止表單提交

            const username = document.getElementById("username").value;
            const email = emailInput.value;
            const verificationCode = verificationCodeInput.value;
            const passwordValue = password.value;
            const confirmPasswordValue = confirmPassword.value;

            // 驗證密碼強度
            if (!strongPasswordRegex.test(passwordValue)) {
                alert("密碼強度不足！請確保包含大小寫字母、數字和特殊符號，且至少 8 個字符。");
                return;
            }

            // 確保密碼一致
            if (passwordValue !== confirmPasswordValue) {
                alert("密碼不一致！");
                return;
            }

            // 確保電子郵件和驗證碼正確
            if (!email || !verificationCode) {
                alert("請填寫電子郵件和驗證碼！");
                return;
            }

            // 發送註冊請求
            try {
                const response = await fetch("/Account/Register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username: username,
                        email: email,
                        verificationCode: verificationCode,
                        password: passwordValue,
                    }),
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    alert("註冊成功！");
                    form.reset(); // 重設表單
                } else {
                    alert(result.message || "註冊失敗，請再試一次");
                }
            } catch (error) {
                console.error("註冊過程中發生錯誤:", error);
                alert("註冊過程中發生錯誤，請稍後再試");
            }
        });
    }
});
