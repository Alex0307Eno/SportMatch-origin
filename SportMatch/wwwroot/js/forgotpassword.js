document.addEventListener("DOMContentLoaded", function () {
    const sendButton = document.getElementById("sendTempPasswordButton");
    const modal = document.getElementById("successModal");
    const closeModalButton = document.getElementById("closeModal");
    const emailInput = document.getElementById("email");
    const messageBox = document.getElementById("tempPassword");

    // 當按下發送臨時密碼按鈕時
    sendButton.addEventListener("click", function () {
        const email = emailInput.value.trim();

        // 驗證電子郵件格式
        if (!isValidEmail(email)) {
            displayMessage("請輸入有效的電子郵件", "error");
            return;
        }

        // 這裡發送請求至伺服器
        fetch('/ForgotPassword/SendTempPassword', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email })
        })
            .then(response => response.json().then(data => ({ status: response.status, body: data })))
            .then(result => handleResponse(result))
            .catch(handleError);
    });

    // 模態視窗的關閉按鈕
    closeModalButton.addEventListener("click", function () {
        modal.style.display = "none"; // 隱藏模態視窗
    });

    // 顯示訊息
    function displayMessage(message, type) {
        messageBox.innerHTML = message;
        messageBox.className = `message ${type}`;
        messageBox.style.opacity = "1"; // 顯示訊息
    }

    // 驗證電子郵件格式
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // 處理 API 響應
    function handleResponse(result) {
        if (result.status === 200) {
            displayMessage("臨時密碼已發送至您的電子郵件。", "success");
            modal.style.display = "flex"; // 顯示模態視窗
        } else {
            displayMessage(result.body.message || "發生錯誤，請稍後再試。", "error");
        }
    }

    // 處理錯誤
    function handleError(error) {
        displayMessage("無法連接到伺服器，請稍後再試。", "error");
        console.error("Request failed: ", error);
    }
});
