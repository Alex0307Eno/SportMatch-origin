// 發送驗證碼按鈕事件
document.getElementById("sendCodeButton").addEventListener("click", function () {
    const email = document.getElementById("email").value;
    const messageElement = document.getElementById("message");

    // 確保電子郵件格式正確
    if (!validateEmail(email)) {
        messageElement.textContent = "請輸入有效的電子郵件地址！";
        messageElement.style.color = "red";
        return;
    }

    // 模擬發送驗證碼
    messageElement.textContent = "已發送驗證碼，請查收您的郵件！";
    messageElement.style.color = "green";

    // 顯示驗證碼區塊
    document.getElementById("verificationSection").classList.remove("hidden");
});

// 驗證碼驗證按鈕事件
document.getElementById("verifyCodeButton").addEventListener("click", function () {
    const verificationCode = document.getElementById("verificationCode").value;
    const messageElement = document.getElementById("message");

    // 假設驗證碼是固定的 '123456'，這裡你可以修改成實際的驗證邏輯
    if (verificationCode === "123456") {
        messageElement.textContent = "驗證碼正確，請設置新密碼！";
        messageElement.style.color = "green";

        // 顯示新密碼區塊
        document.getElementById("newPasswordSection").classList.remove("hidden");
    } else {
        messageElement.textContent = "驗證碼錯誤，請重試！";
        messageElement.style.color = "red";
    }
});

// 提交新密碼
document.getElementById("resetPasswordForm").addEventListener("submit", function (e) {
    e.preventDefault(); // 防止表單提交

    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const messageElement = document.getElementById("message");

    // 密碼匹配驗證
    if (newPassword !== confirmPassword) {
        messageElement.textContent = "新密碼與確認密碼不一致，請重新輸入！";
        messageElement.style.color = "red";
        return;
    }

    // 密碼長度驗證（假設最短 8 位且包含大小寫和特殊字符）
    if (newPassword.length < 8) {
        messageElement.textContent = "密碼至少需包含 8 位數字或字母！";
        messageElement.style.color = "red";
        return;
    }

    // 密碼設置成功
    messageElement.textContent = "密碼重設成功！";
    messageElement.style.color = "green";

    // 模擬跳轉或顯示提示
    setTimeout(function () {
        window.location.href = "/"; // 跳轉回首頁或其他頁面
    }, 2000);
});

// 驗證電子郵件格式的函數
function validateEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
}
