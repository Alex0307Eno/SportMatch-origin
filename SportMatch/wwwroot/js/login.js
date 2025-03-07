// 監聽登入表單提交
const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async function (e) {
    e.preventDefault(); // 防止表單提交

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const remember = document.getElementById("remember").checked;

    const errorMessageElement = document.querySelector(".error-message");
    errorMessageElement.style.display = "none"; // 清除之前的錯誤訊息

    try {
        const response = await fetch('/Account/Login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
                remember: remember
            }),
        });

        const result = await response.json();
        if (response.ok && result.success) {
            // 登入成功
            if (remember) {
                localStorage.setItem("savedEmail", email);
            } else {
                localStorage.removeItem("savedEmail");
            }

            // 儲存登入狀態
            localStorage.setItem("loggedInEmail", email);
            localStorage.setItem("isLoggedIn", "true");  // 設定登入狀態為 true

            updateUIAfterLogin(email);  // 更新 UI 顯示

            closeModal();
            alert("登入成功！");
        } else {
            // 登入失敗
            if (errorMessageElement) {
                errorMessageElement.textContent = result.message || "帳號或密碼錯誤，請重新嘗試。";
                errorMessageElement.style.display = "block";
            }
        }
    } catch (error) {
        console.error('登入過程中發生錯誤:', error);
        const errorMessageElement = document.querySelector(".error-message");
        if (errorMessageElement) {
            errorMessageElement.textContent = "登入過程中發生錯誤，請稍後再試。";
            errorMessageElement.style.display = "block";
        }
    }
});

// 登出功能
function logout() {
    localStorage.removeItem("loggedInEmail");
    localStorage.removeItem("isLoggedIn");
    location.reload();  // 登出後重新載入頁面
}

// 在頁面加載時檢查登入狀態
window.onload = function () {
    const modal = document.getElementById("loginModal");
    modal.style.display = "none";
    modal.classList.remove("show");

    // 檢查用戶是否已登入
    if (getLoginStatus()) {
        updateUIAfterLogin(localStorage.getItem("loggedInEmail")); // 用戶已登入，更新 UI
    }
};

// 登入狀態檢查函式
function getLoginStatus() {
    return localStorage.getItem("isLoggedIn") === "true";  // 檢查 localStorage 中的登入狀態
}

function updateUIAfterLogin(email) {
    // 根據登入的用戶 email 更新 UI 顯示，例如顯示用戶的名字或電郵地址等
    console.log(`用戶 ${email} 已登入！`);
}

document.addEventListener("DOMContentLoaded", function () {
    checkLoginStatus();
});

function checkLoginStatus() {
    let isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    let userEmail = localStorage.getItem("userEmail");

    if (isLoggedIn) {
        document.querySelector(".cart-container").style.display = "block";
        document.querySelector(".notifications-container").style.display = "block";
        document.querySelector(".user-email-container").style.display = "block";

        if (userEmail) {
            document.querySelector(".user-email").innerText = userEmail;
        }
    } else {
        document.querySelector(".cart-container").style.display = "none";
        document.querySelector(".notifications-container").style.display = "none";
        document.querySelector(".user-email-container").style.display = "none";
    }
}

// 處理登入
function loginUser(email) {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userEmail", email);
    checkLoginStatus();
    console.log("用戶已登入：" + email);
}

// 處理登出
function handleLogout() {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    checkLoginStatus();
    console.log("用戶已登出");
}
