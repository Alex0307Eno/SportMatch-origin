document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("registerForm");
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirm-password");
    const sendCodeBtn = document.getElementById("sendCodeBtn");
    const emailInput = document.getElementById("email");
    const verificationCodeInput = document.getElementById("verification-code");
    const usernameInput = document.getElementById("username");
    const guiCode = document.getElementById("guiCode");
    const countdown = document.getElementById("countdown");

    let countdownTimer;



    // 按鈕初始狀態為禁用
    sendCodeBtn.disabled = true;
    sendCodeBtn.classList.add("disabled");

    // 驗證 Email 格式的函數
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // 監聽輸入框變化
    emailInput.addEventListener("input", function () {
        if (isValidEmail(emailInput.value)) {
            sendCodeBtn.disabled = false;
            sendCodeBtn.classList.remove("disabled");
        } else {
            sendCodeBtn.disabled = true;
            sendCodeBtn.classList.add("disabled");
        }
    });

    // 發送驗證碼按鈕事件
    sendCodeBtn.addEventListener("click", async function () {
        if (!isValidEmail(emailInput.value)) {
            alert("請輸入有效的電子郵件地址！");
            return;
        }

        // 禁用按鈕並開始倒數
        sendCodeBtn.disabled = true;
        sendCodeBtn.classList.add("disabled");
        startCountdown();

        try {
            const response = await fetch("/Account/SendVerificationCode", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: emailInput.value })
            });
            const result = await response.json();
            if (response.ok && result.success) {
                alert("驗證碼已發送到您的電子郵件！");
            } else {
                alert(result.message || "發送失敗，請再試一次");
            }
        } catch (error) {
            console.error("發送驗證碼錯誤:", error);
            alert("發送錯誤，請稍後再試");
        }
    });


    // 倒數邏輯
    function startCountdown() {
        let timeLeft = 60;
        countdown.style.display = "inline"; // 顯示倒數文字
        countdown.textContent = `${timeLeft} 秒`;

        countdownTimer = setInterval(function () {
            timeLeft--;
            countdown.textContent = `${timeLeft} 秒`;
            if (timeLeft <= 0) {
                clearInterval(countdownTimer);
                countdown.style.display = "none"; // 隱藏倒數文字
                sendCodeBtn.disabled = false;
                sendCodeBtn.classList.remove("disabled");
            }
        }, 1000);
    }

    document.addEventListener("DOMContentLoaded", function () {
        const guiNumberInput = document.getElementById("guiNumber");

        // 限制只允許輸入 8 位數字
        guiNumberInput.addEventListener("input", function () {
            // 只允許數字並限制為 8 位
            this.value = this.value.replace(/[^0-9]/g, "").slice(0, 8);
        });
    });


    // 密碼顯示切換
    function togglePasswordVisibility(inputId, button) {
        const input = document.getElementById(inputId);
        if (input) {
            if (input.type === "password") {
                input.type = "text";
                button.textContent = "🙈"; // 變成隱藏圖示
            } else {
                input.type = "password";
                button.textContent = "👁"; // 變成顯示圖示
            }
        }
    }

    // 驗證碼輸入限制
    verificationCodeInput.addEventListener("input", function () {
        this.value = this.value.replace(/[^0-9]/g, "").slice(0, 4);
    });

    // 表單提交
    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        if (password.value !== confirmPassword.value) {
            alert("密碼不一致！");
            return;
        }


        // 構建請求的資料
        const requestData = {
            username: usernameInput.value,
            email: emailInput.value,
            verificationCode: verificationCodeInput.value,
            password: password.value
        };

        // 如果 guiCode 有值，則將其添加到資料中
        if (guiCode.value) {
            requestData.guiCode = guiCode.value;
        }
        try {
            const response = await fetch("/Account/Register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestData)
            });
            const result = await response.json();
            if (response.ok && result.success) {
                alert("註冊成功！");
                localStorage.setItem("savedEmail", emailInput.value);
                window.location.href = "/";
            } else {
                alert(result.message || "註冊失敗");
            }
        } catch (error) {
            console.error("註冊錯誤:", error);
            alert("註冊錯誤，請稍後再試");
        }
    });

    if (localStorage.getItem("savedEmail")) {
        emailInput.value = localStorage.getItem("savedEmail");
    }
});

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