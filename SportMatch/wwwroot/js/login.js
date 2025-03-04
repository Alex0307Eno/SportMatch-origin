window.onload = function () {
    const modal = document.getElementById("loginModal");
    modal.style.display = "none";
    modal.classList.remove("show");
};

// 打開登入模態框
function openLoginModal() {
    const modal = document.getElementById("loginModal");
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
}

// 關閉登入模態框
function closeModal() {
    const modal = document.getElementById("loginModal");
    modal.style.display = "none";
    document.body.style.overflow = "auto";
    document.body.style.position = "";
    document.body.style.width = "";
}

// 登出功能
function logout() {
    localStorage.removeItem("loggedInEmail");
    localStorage.removeItem("isLoggedIn");
    location.reload();
}

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

            localStorage.setItem("loggedInEmail", email);
            updateUIAfterLogin(email);

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

// 更新登入後的 UI 顯示

function updateUIAfterLogin(username = "") {
    document.querySelector(".btn-login").style.display = "none";  // 隱藏登入按鈕
    document.querySelector(".btn-register").style.display = "none";  // 隱藏註冊按鈕

    let userNameContainer = document.querySelector(".user-name-container");
    if (!userNameContainer) {
        userNameContainer = document.createElement("div");
        userNameContainer.classList.add("user-name-container");

        const userName = document.createElement("span");
        userName.classList.add("user-name");

        const dropdownContent = document.createElement("div");
        dropdownContent.classList.add("dropdown-content");

        const profileLink = document.createElement("a");
        profileLink.href = "#profile";
        profileLink.textContent = "個人資料";

        const cartLink = document.createElement("a");
        cartLink.href = "#cart";
        cartLink.textContent = "購物車清單";

        const favoritesLink = document.createElement("a");
        favoritesLink.href = "#favorites";
        favoritesLink.textContent = "收藏清單";

        const logoutButton = document.createElement("button");
        logoutButton.textContent = "登出";
        logoutButton.classList.add("btn-logout");
        logoutButton.onclick = logout;  // 綁定登出邏輯

        dropdownContent.appendChild(profileLink);
        dropdownContent.appendChild(cartLink);
        dropdownContent.appendChild(favoritesLink);
        dropdownContent.appendChild(logoutButton);
        userNameContainer.appendChild(userName);
        userNameContainer.appendChild(dropdownContent);
        document.querySelector(".user-actions").appendChild(userNameContainer);
    }

    if (username) {
        document.querySelector(".user-name").textContent = `${username}`;
    } else {
        document.querySelector(".user-name").textContent = username;
    }
}









// 密碼顯示/隱藏邏輯
const togglePassword = document.querySelector(".toggle-password");
const passwordInput = document.getElementById("password");

togglePassword.addEventListener("click", function () {
    const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);
    this.querySelector("i").classList.toggle("lock-closed");
    this.querySelector("i").classList.toggle("lock-open-ooutline");
});

// 自動填充帳號
const savedEmail = localStorage.getItem("savedEmail");
if (savedEmail) {
    document.getElementById("email").value = savedEmail;
    document.getElementById("remember").checked = true;
}

// 顯示當前登錄的帳號
const loggedInEmail = localStorage.getItem("loggedInEmail");
if (loggedInEmail) {
    updateUIAfterLogin(loggedInEmail);
}

function checkLogin(targetUrl) {
    // 從 localStorage 檢查是否登入（這需要在登入時設定）
    let isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (isLoggedIn) {
        window.location.href = targetUrl; // 已登入，正常跳轉
    } else {
        let confirmLogin = confirm("您尚未登入，是否要立即登入？");
        if (confirmLogin) {
            openLoginModal(); // 打開登入視窗
        }
    }
}

// 登入狀態檢查函式
function getLoginStatus() {
    return localStorage.getItem("isLoggedIn") === "true";
}
