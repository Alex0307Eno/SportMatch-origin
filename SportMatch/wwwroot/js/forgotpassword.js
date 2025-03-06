document.addEventListener("DOMContentLoaded", function () {
    const sendCodeButton = document.getElementById("sendCodeButton");
    const verifyCodeButton = document.getElementById("verifyCodeButton");
    const submitNewPasswordButton = document.getElementById("submitNewPassword");
    const messageDiv = document.getElementById("message");

    // 顯示訊息的函數
    function displayMessage(message, isSuccess) {
        messageDiv.textContent = message;
        messageDiv.style.color = isSuccess ? 'green' : 'red';
    }

    // 發送驗證碼按鈕的事件處理器
    sendCodeButton.addEventListener("click", async function () {
        const email = document.getElementById("email").value;
        if (!email) {
            displayMessage("請輸入電子郵件地址！", false);
            return;
        }

        // 禁用發送驗證碼按鈕，並開始倒數 60 秒
        sendCodeButton.disabled = true;
        let countdown = 60; // 設定倒數秒數
        const originalButtonText = sendCodeButton.textContent; // 儲存原始的按鈕文字

        const countdownInterval = setInterval(function () {
            sendCodeButton.textContent = `等待 ${countdown--} 秒`;
            if (countdown < 0) {
                clearInterval(countdownInterval);
                sendCodeButton.disabled = false;
                sendCodeButton.textContent = originalButtonText; // 恢復按鈕文字
            }
        }, 1000);

        try {
            const response = await fetch("/Account/SendForgotPasswordVerificationCode", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email })
            });

            const result = await response.json();
            displayMessage(result.message, result.success);

            // 如果發送驗證碼成功，顯示驗證碼區塊
            if (result.success) {
                document.getElementById("verificationSection").classList.remove("hidden");
            }
        } catch (error) {
            displayMessage("發送驗證碼時出錯，請稍後再試！", false);
        }
    });

    // 驗證驗證碼按鈕的事件處理器
    verifyCodeButton.addEventListener("click", async function () {
        const email = document.getElementById("email").value;
        const verificationCode = document.getElementById("verificationCode").value;

        try {
            const response = await fetch("/Account/VerifyForgotPasswordVerificationCode", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email, verificationCode: verificationCode })
            });

            const result = await response.json();
            displayMessage(result.message, result.success);

            // 如果驗證碼正確，顯示新密碼區塊
            if (result.success) {
                document.getElementById("verificationSection").classList.add("hidden");
                document.getElementById("newPasswordSection").classList.remove("hidden");
            }
        } catch (error) {
            displayMessage("驗證驗證碼時出錯，請稍後再試！", false);
        }
    });

    submitNewPasswordButton.addEventListener("click", async function (event) {
        event.preventDefault();

        const email = document.getElementById("email").value;
        const newPassword = document.getElementById("newPassword").value;
        const confirmPassword = document.getElementById("newPasswordConfirm").value;

        // 新密碼和確認密碼不一致的提示
        if (newPassword !== confirmPassword) {
            displayMessage("新密碼和確認密碼不一致！", false);
            return;
        }

        try {
            const response = await fetch("/Account/ResetPassword", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: email,
                    newPassword: newPassword,
                    confirmPassword: confirmPassword
                })
            });

            const result = await response.json();

            // 檢查驗證碼是否過期的情況
            if (result.success === false) {
                displayMessage(result.message, false);
                return;
            }

            displayMessage(result.message, result.success);
        } catch (error) {
            displayMessage("重設密碼時出錯，請稍後再試！", false);
        }
    });

});
