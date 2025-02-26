document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("registerForm");
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirm-password");
    const errorMessage = document.getElementById("errorMessage");
    const sendCodeBtn = document.getElementById("sendCodeBtn");
    const emailInput = document.getElementById("email");
    const verificationCodeInput = document.getElementById("verification-code");

    // 註冊成功通知容器
    const successNotification = document.createElement("div");
    successNotification.id = "successNotification";
    successNotification.textContent = "註冊成功！歡迎加入！";
    successNotification.style.display = "none";
    document.body.appendChild(successNotification);

    // 隱藏通知並跳轉到首頁
    const hideNotification = () => {
        successNotification.style.opacity = "0";
        setTimeout(() => {
            successNotification.style.display = "none";
            window.location.href = "/"; // 跳轉到首頁
        }, 300); // 與 CSS 過渡時間一致
    };

    // 顯示通知
    const showNotification = () => {
        successNotification.style.display = "block";
        setTimeout(() => {
            successNotification.style.opacity = "1";
        }, 10); // 確保過渡效果正常觸發
        setTimeout(hideNotification, 3000); // 3秒後隱藏並跳轉
    };

    // 發送驗證碼按鈕處理
    if (sendCodeBtn) {
        sendCodeBtn.addEventListener("click", async function () {
            const email = emailInput.value;

            if (!email) {
                alert("請輸入電子郵件地址！");
                return;
            }

            // 發送驗證碼到後端
            try {
                const response = await fetch("/Account/SendVerificationCode", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email: email }),
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    alert("驗證碼已發送到您的電子郵件！");
                } else {
                    alert(result.message || "發送驗證碼失敗，請再試一次");
                }
            } catch (error) {
                console.error('發送驗證碼過程中發生錯誤:', error);
                alert("發送驗證碼過程中發生錯誤，請稍後再試");
            }
        });
    }

    // 表單提交處理
    if (form) {
        form.addEventListener("submit", async function (event) {
            event.preventDefault(); // 防止表單提交

            // 簡單的前端驗證
            const username = document.getElementById("username").value;
            const email = emailInput.value;
            const verificationCode = verificationCodeInput.value;
            const passwordValue = password.value;
            const confirmPasswordValue = confirmPassword.value;

            if (passwordValue !== confirmPasswordValue) {
                alert("密碼不一致！");
                return;
            }

            // 確保電子郵件和驗證碼正確
            if (!email || !verificationCode) {
                alert("請填寫電子郵件和驗證碼！");
                return;
            }

            // 模擬向後端發送註冊請求
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
                    showNotification();
                    form.reset(); // 重設表單
                } else {
                    alert(result.message || "註冊失敗，請再試一次");
                }
            } catch (error) {
                console.error('註冊過程中發生錯誤:', error);
                alert("註冊過程中發生錯誤，請稍後再試");
            }
        });
    }
});
