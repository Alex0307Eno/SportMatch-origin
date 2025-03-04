document.addEventListener("DOMContentLoaded", function () {
    const emailInput = document.getElementById("email");
    const sendCodeButton = document.getElementById("sendCodeButton");
    const verificationSection = document.getElementById("verificationSection");
    const verificationCodeInput = document.getElementById("verificationCode");
    const verifyCodeButton = document.getElementById("verifyCodeButton");
    const newPasswordSection = document.getElementById("newPasswordSection");
    const newPasswordInput = document.getElementById("newPassword");
    const submitNewPasswordButton = document.getElementById("submitNewPassword");
    const messageDiv = document.getElementById("message");

    // 🔹 點擊「發送驗證碼」按鈕
    sendCodeButton.addEventListener("click", function () {
        const email = emailInput.value.trim();

        if (email === "") {
            showMessage("請輸入電子郵件", "error");
            return;
        }

        // TODO: 這裡應該呼叫後端 API 發送驗證碼
        console.log(`發送驗證碼至: ${email}`);

        // 顯示驗證碼輸入區
        verificationSection.classList.remove("hidden");
        showMessage("驗證碼已發送，請檢查您的信箱。", "success");
    });

    // 🔹 點擊「驗證」按鈕
    verifyCodeButton.addEventListener("click", function () {
        const code = verificationCodeInput.value.trim();

        if (code === "") {
            showMessage("請輸入驗證碼", "error");
            return;
        }

        // TODO: 這裡應該呼叫後端 API 檢查驗證碼是否正確
        const isValidCode = true; // 假設驗證成功

        if (isValidCode) {
            showMessage("驗證成功，請輸入新密碼。", "success");

            // 顯示「新密碼輸入區塊」
            newPasswordSection.classList.remove("hidden");
        } else {
            showMessage("驗證碼錯誤，請重新輸入。", "error");
        }
    });

    // 🔹 顯示訊息
    function showMessage(text, type) {
        messageDiv.textContent = text;
        messageDiv.className = `message ${type}`;
    }
});
