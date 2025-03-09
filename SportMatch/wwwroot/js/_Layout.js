// ✅ 自訂確認框
function customConfirm(message, callback) {
    let modal = document.getElementById("custom-confirm");
    let confirmMessage = document.getElementById("confirm-message");
    let confirmYes = document.getElementById("confirm-yes");
    let confirmNo = document.getElementById("confirm-no");

    confirmMessage.innerText = message; // 設定訊息
    modal.style.display = "flex"; // 顯示確認框

    confirmYes.onclick = function () {
        modal.style.display = "none";
        callback(true);
    };

    confirmNo.onclick = function () {
        modal.style.display = "none";
        callback(false);
    };
}

// ✅ 檢查用戶是否登入
function isLoggedIn() {
    return localStorage.getItem("isLoggedIn") === "true";
}

// ✅ 設定 UI 狀態 (顯示/隱藏登入後功能)
function updateUI() {
    let userEmailContainer = document.querySelector(".user-email-container");
    let cartContainer = document.querySelector(".cart-container");
    let notificationsContainer = document.querySelector(".notifications-container");

    if (isLoggedIn()) {
        console.log("✅ 用戶已登入");
        userEmailContainer.style.display = "block"; // 顯示個人資料
        cartContainer.style.display = "block"; // 顯示購物車
        notificationsContainer.style.display = "block"; // 顯示通知
    } else {
        console.log("❌ 用戶未登入");
        userEmailContainer.style.display = "none"; // 隱藏個人資料
        cartContainer.style.display = "none"; // 隱藏購物車
        notificationsContainer.style.display = "none"; // 隱藏通知
    }
}

// ✅ 登入函數
function loginUser() {
    updateUI(); // 更新 UI

    localStorage.setItem("isLoggedIn", "true");  // 設定登入狀態
    console.log("🎉 用戶已登入");
}

// ✅ 退出登入
function logoutUser() {
    localStorage.removeItem("isLoggedIn");  // 移除登入標記
    console.log("👋 用戶已登出");
    updateUI(); // 更新 UI
}

// ✅ 攔截未登入的使用者
function promptLogin(event) {
    event.preventDefault();  // 防止預設跳轉
    if (!isLoggedIn()) {
        customConfirm("您尚未登入，是否要立即登入？", function (confirmLogin) {
            if (confirmLogin) {
                openLoginModal();  // 顯示登入彈窗
            }
        });
    } else {
        window.location.href = event.target.href;  // 允許跳轉
    }
}

// ✅ 綁定按鈕事件
document.addEventListener("DOMContentLoaded", function () {
    updateUI(); // 檢查並更新 UI

    let matchingLink = document.getElementById("matchingLink");
    let eventsLink = document.getElementById("eventsLink");
    let logoutButton = document.querySelector(".btn-logout");

    if (matchingLink) matchingLink.addEventListener("click", promptLogin);
    if (eventsLink) eventsLink.addEventListener("click", promptLogin);
    if (logoutButton) logoutButton.addEventListener("click", logoutUser);
});


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
                console.log("用戶已登入");

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

function updateUIAfterLogin(email) {
    console.log(`✅ 用戶 ${email} 已登入！`);

    const loginBtn = document.querySelector(".btn-login");
    const registerBtn = document.querySelector(".btn-register"); // 確保選取到註冊按鈕
    const logoutBtn = document.querySelector(".logout-btn");
    const userEmailContainer = document.querySelector(".user-email-container");
    const userEmail = document.querySelector(".user-email");
    const cartContainer = document.querySelector(".cart-container");
    const notificationsContainer = document.querySelector(".notifications-container");

    if (loginBtn) loginBtn.style.display = "none";
    if (registerBtn) registerBtn.style.display = "none"; // ✅ 隱藏註冊按鈕
    if (logoutBtn) logoutBtn.style.display = "block";
    if (userEmailContainer) userEmailContainer.style.display = "block";
    if (userEmail) userEmail.innerText = email;
    if (cartContainer) cartContainer.style.display = "block";
    if (notificationsContainer) notificationsContainer.style.display = "block";
}


// 登出功能
function handleLogout() {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");

    // 更新 UI，顯示登入按鈕，隱藏登出按鈕與使用者資訊
    document.querySelector(".login-btn").style.display = "block";
    document.querySelector(".logout-btn").style.display = "none";
    document.querySelector(".user-email-container").style.display = "none";

    checkLoginStatus();
    console.log("用戶已登出");
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



document.addEventListener("DOMContentLoaded", function () {
    checkLoginStatus();
});

function checkLoginStatus() {
    function checkLoginStatus() {
        let isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
        let userEmail = localStorage.getItem("userEmail");

        const loginBtn = document.querySelector(".login-btn");
        const registerBtn = document.querySelector(".register-btn");
        const logoutBtn = document.querySelector(".logout-btn");
        const userEmailContainer = document.querySelector(".user-email-container");
        const cartContainer = document.querySelector(".cart-container");
        const notificationsContainer = document.querySelector(".notifications-container");

        if (isLoggedIn) {
            if (loginBtn) loginBtn.style.display = "none";
            if (registerBtn) registerBtn.style.display = "none"; // ✅ 隱藏註冊按鈕
            if (logoutBtn) logoutBtn.style.display = "block";
            if (userEmailContainer) userEmailContainer.style.display = "block";
            if (userEmail) document.querySelector(".user-email").innerText = userEmail;
            if (cartContainer) cartContainer.style.display = "block";
            if (notificationsContainer) notificationsContainer.style.display = "block";
        } else {
            if (loginBtn) loginBtn.style.display = "block";
            if (registerBtn) registerBtn.style.display = "block"; // ✅ 確保註冊按鈕顯示
            if (logoutBtn) logoutBtn.style.display = "none";
            if (userEmailContainer) userEmailContainer.style.display = "none";
            if (cartContainer) cartContainer.style.display = "none";
            if (notificationsContainer) notificationsContainer.style.display = "none";
        }
    }

}

// 處理登入
function loginUser(email) {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userEmail", email);

}

// 處理登出
function handleLogout() {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    checkLoginStatus();
    console.log("用戶已登出");
}

//下拉選單
function toggleNotifications() {
    const dropdown = document.querySelector(".notifications-dropdown");
    dropdown.classList.toggle("active");
}

function toggleCart() {
    const dropdown = document.querySelector(".cart-dropdown");
    dropdown.classList.toggle("active");
}

function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    localStorage.setItem("loggedInEmail", email);
    document.querySelector(".btn-login").style.display = "none";
    document.querySelector(".btn-register").style.display = "none";
    document.querySelector(".user-email-container").style.display = "flex";
    document.querySelector(".user-email").textContent = email;
    document.querySelector(".cart-container").style.display = "flex";
    document.querySelector(".notifications-container").style.display = "flex";
    closeModal();
    document.body.style.overflow = "auto"; // 允許滾動
}

function handleLogout() {
    localStorage.removeItem("loggedInEmail");
    document.querySelector(".btn-login").style.display = "block";
    document.querySelector(".btn-register").style.display = "block";
    document.querySelector(".user-email-container").style.display = "none";
    document.querySelector(".cart-container").style.display = "none";
    document.querySelector(".notifications-container").style.display = "none";
}

function openLoginModal() {
    document.getElementById("loginModal").style.display = "block";
    document.body.style.overflow = "hidden"; // 禁止滾動
}

function closeModal() {
    document.getElementById("loginModal").style.display = "none";
    document.body.style.overflow = "auto"; // 允許滾動
}

document.addEventListener("DOMContentLoaded", function () {
    const loggedInEmail = localStorage.getItem("loggedInEmail");
    if (loggedInEmail) {
        document.querySelector(".btn-login").style.display = "none";
        document.querySelector(".btn-register").style.display = "none";
        document.querySelector(".user-email-container").style.display = "flex";
        document.querySelector(".user-email").textContent = loggedInEmail;
        document.querySelector(".cart-container").style.display = "flex";
        document.querySelector(".notifications-container").style.display = "flex";
    }
});

// 初始化時不顯示登入浮窗
document.addEventListener("DOMContentLoaded", function () {
    // 初始化所有功能
    initializeAnimations();
    initializeSliders();
    initializeModals();
    initializeScrollEffects();
    initializeCarousel();
    initializeVenuesSlider();
});

// 動畫效果
function initializeAnimations() {
    // 使用 Intersection Observer 監控元素出現
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("fade-in");
                    observer.unobserve(entry.target); // 動畫只執行一次
                }
            });
        },
        {
            threshold: 0.1,
            rootMargin: "0px",
        }
    );

    // 為所有需要動畫的元素添加觀察
    const animatedElements = document.querySelectorAll(
        ".feature-card, .event-card, .venue-card, .section-title"
    );
    animatedElements.forEach((el) => observer.observe(el));
}

// 輪播功能
function initializeSliders() {
    // 當季賽事輪播圖
    const carousel = document.querySelector(".events-carousel");
    if (carousel) {
        const track = carousel.querySelector(".carousel-track");
        const slides = Array.from(track.children);
        const nextButton = carousel.querySelector(".next");
        const prevButton = carousel.querySelector(".prev");
        const dotsContainer = carousel.querySelector(".carousel-dots");

        const dots = Array.from(dotsContainer.children);
        let currentSlide = 0;

        // 更新輪播圖位置
        const updateCarousel = (index) => {
            track.style.transform = `translateX(-${index * 100}%)`;
            dots.forEach((dot, i) => {
                dot.classList.toggle("active", i === index);
            });
            currentSlide = index;
        };

        // 自動輪播
        let autoplayInterval = setInterval(() => {
            const nextIndex = (currentSlide + 1) % slides.length;
            updateCarousel(nextIndex);
        }, 5000);

        // 重置自動輪播計時器
        const resetAutoplay = () => {
            clearInterval(autoplayInterval);
            autoplayInterval = setInterval(() => {
                const nextIndex = (currentSlide + 1) % slides.length;
                updateCarousel(nextIndex);
            }, 5000);
        };

        // 按鈕事件
        nextButton.addEventListener("click", () => {
            const nextIndex = (currentSlide + 1) % slides.length;
            updateCarousel(nextIndex);
            resetAutoplay();
        });

        prevButton.addEventListener("click", () => {
            const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
            updateCarousel(prevIndex);
            resetAutoplay();
        });

        // 觸控滑動支援
        let touchStartX = 0;
        let touchEndX = 0;

        carousel.addEventListener("touchstart", (e) => {
            touchStartX = e.touches[0].clientX;
        });

        carousel.addEventListener("touchend", (e) => {
            touchEndX = e.changedTouches[0].clientX;
            const difference = touchStartX - touchEndX;

            if (Math.abs(difference) > 50) {
                if (difference > 0) {
                    // 向左滑
                    const nextIndex = (currentSlide + 1) % slides.length;
                    updateCarousel(nextIndex);
                } else {
                    // 向右滑
                    const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
                    updateCarousel(prevIndex);
                }
                resetAutoplay();
            }
        });
    }

    // 場地滑動功能
    const venuesSlider = document.querySelector(".venues-slider");
    if (venuesSlider) {
        let isDown = false;
        let startX;
        let scrollLeft;

        venuesSlider.addEventListener("mousedown", (e) => {
            isDown = true;
            venuesSlider.classList.add("active");
            startX = e.pageX - venuesSlider.offsetLeft;
            scrollLeft = venuesSlider.scrollLeft;
        });

        venuesSlider.addEventListener("mouseleave", () => {
            isDown = false;
            venuesSlider.classList.remove("active");
        });

        venuesSlider.addEventListener("mouseup", () => {
            isDown = false;
            venuesSlider.classList.remove("active");
        });

        venuesSlider.addEventListener("mousemove", (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - venuesSlider.offsetLeft;
            const walk = (x - startX) * 2;
            venuesSlider.scrollLeft = scrollLeft - walk;
        });
    }
}

// 模態框功能
function initializeModals() {
    const loginBtn = document.querySelector(".btn-login");
    const modal = document.getElementById("loginModal");
    const closeModal = document.querySelector(".close-modal");

    if (loginBtn && modal) {
        loginBtn.addEventListener("click", () => {
            modal.classList.add("show");
            document.body.classList.add("modal-open"); // 禁用頁面滾動
        });

        closeModal.addEventListener("click", () => {
            modal.classList.remove("show");
            document.body.classList.remove("modal-open"); // 允許滾動
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && modal.classList.contains("show")) {
                modal.classList.remove("show");
                document.body.classList.remove("modal-open");
            }
        });
    }
}

// 滾動效果
function initializeScrollEffects() {
    // 平滑滾動到錨點
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();

            const target = document.querySelector(this.getAttribute("href"));
            if (target) {
                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }
        });
    });
}

// 輪播圖功能
function initializeCarousel() {
    const carousel = document.querySelector(".events-carousel");
    if (!carousel) return;

    const track = carousel.querySelector(".carousel-track");
    const slides = Array.from(track.children);
    const nextButton = carousel.querySelector(".next");
    const prevButton = carousel.querySelector(".prev");
    const dotsContainer = carousel.querySelector(".carousel-dots");

    const dots = Array.from(dotsContainer.children);
    let currentSlide = 0;

    // 更新輪播圖位置
    const updateCarousel = (index) => {
        track.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach((dot, i) => {
            dot.classList.toggle("active", i === index);
        });
        currentSlide = index;
    };

    // 自動輪播
    let autoplayInterval = setInterval(() => {
        const nextIndex = (currentSlide + 1) % slides.length;
        updateCarousel(nextIndex);
    }, 5000);

    // 重置自動輪播計時器
    const resetAutoplay = () => {
        clearInterval(autoplayInterval);
        autoplayInterval = setInterval(() => {
            const nextIndex = (currentSlide + 1) % slides.length;
            updateCarousel(nextIndex);
        }, 5000);
    };

    // 按鈕事件
    nextButton.addEventListener("click", () => {
        const nextIndex = (currentSlide + 1) % slides.length;
        updateCarousel(nextIndex);
        resetAutoplay();
    });

    prevButton.addEventListener("click", () => {
        const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
        updateCarousel(prevIndex);
        resetAutoplay();
    });

    // 觸控滑動支援
    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener("touchstart", (e) => {
        touchStartX = e.touches[0].clientX;
    });

    carousel.addEventListener("touchend", (e) => {
        touchEndX = e.changedTouches[0].clientX;
        const difference = touchStartX - touchEndX;

        if (Math.abs(difference) > 50) {
            if (difference > 0) {
                const nextIndex = (currentSlide + 1) % slides.length;
                updateCarousel(nextIndex);
            } else {
                const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
                updateCarousel(prevIndex);
            }
            resetAutoplay();
        }
    });
}

// 場地滑動功能
function initializeVenuesSlider() {
    const slider = document.querySelector(".venues-slider");
    if (!slider) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    slider.addEventListener("mousedown", (e) => {
        isDown = true;
        slider.classList.add("active");
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener("mouseleave", () => {
        isDown = false;
        slider.classList.remove("active");
    });

    slider.addEventListener("mouseup", () => {
        isDown = false;
        slider.classList.remove("active");
    });

    slider.addEventListener("mousemove", (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2;
        slider.scrollLeft = scrollLeft - walk;
    });
}

// 表單驗證
function validateForm(form) {
    const inputs = form.querySelectorAll("input[required]");
    let isValid = true;

    inputs.forEach((input) => {
        if (!input.value.trim()) {
            isValid = false;
            showError(input, "此欄位為必填");
        } else {
            clearError(input);
        }

        if (input.type === "email" && input.value) {
            const emailRegex = /^[^\s@@]+@@[^\s@@]+\.[^\s@@]+$/;
            if (!emailRegex.test(input.value)) {
                isValid = false;
                showError(input, "請輸入有效的電子郵件地址");
            }
        }
    });

    return isValid;
}

// 顯示錯誤訊息
function showError(input, message) {
    const errorDiv = input.nextElementSibling?.classList.contains("error-message")
        ? input.nextElementSibling
        : document.createElement("div");

    errorDiv.className = "error-message";
    errorDiv.textContent = message;

    if (!input.nextElementSibling?.classList.contains("error-message")) {
        input.parentNode.insertBefore(errorDiv, input.nextSibling);
    }

    input.classList.add("error");
}

// 清除錯誤訊息
function clearError(input) {
    const errorDiv = input.nextElementSibling;
    if (errorDiv?.classList.contains("error-message")) {
        errorDiv.remove();
    }
    input.classList.remove("error");
}











// Select the hamburger menu and nav links
const hamburgerMenu = document.querySelector('.hamburger-menu');
const navLinks = document.querySelector('.nav-links');

// Toggle the 'active' class when the hamburger menu is clicked
hamburgerMenu.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// This function toggles the active class for the mobile menu
function toggleHamburgerMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}


