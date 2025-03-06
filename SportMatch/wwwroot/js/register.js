document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("registerForm");
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirm-password");
    const sendCodeBtn = document.getElementById("sendCodeBtn");
    const emailInput = document.getElementById("email");
    const verificationCodeInput = document.getElementById("verification-code");
    const usernameInput = document.getElementById("username");
    const countdown = document.getElementById("countdown");

    let countdownTimer;

    // 發送驗證碼按鈕事件
    sendCodeBtn.addEventListener("click", async function () {
        if (!emailInput.value) {
            alert("請輸入電子郵件地址！");
            return; // 如果沒有輸入信箱就直接返回
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
        try {
            const response = await fetch("/Account/Register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: usernameInput.value,
                    email: emailInput.value,
                    verificationCode: verificationCodeInput.value,
                    password: password.value,
                })
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
