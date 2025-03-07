document.addEventListener("DOMContentLoaded", function () {
    // 初始化所有功能
    initializeAnimations();
    initializeSliders();
    initializeModals();
    initializeSearch();
    initializeScrollEffects();
    initializeCarousel();
    initializeVenuesSlider();

    if (localStorage.getItem("showLoginModal") === "true") {
        document.getElementById("loginModal").classList.add("show");
        localStorage.removeItem("showLoginModal");
    }
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

        // 創建導航點
        slides.forEach((_, index) => {
            const dot = document.createElement("button");
            dot.classList.add("carousel-dot");
            if (index === 0) dot.classList.add("active");
            dotsContainer.appendChild(dot);
        });

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

        // 導航點事件
        dots.forEach((dot, index) => {
            dot.addEventListener("click", () => {
                updateCarousel(index);
                resetAutoplay();
            });
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

    if (loginBtn && modal) {
        loginBtn.addEventListener("click", () => {
            modal.style.display = "flex";
            document.body.style.overflow = "hidden";
        });

        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.style.display = "none";
                document.body.style.overflow = "auto";
            }
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && modal.style.display === "flex") {
                modal.style.display = "none";
                document.body.style.overflow = "auto";
            }
        });
    }
}

// 搜尋功能
function initializeSearch() {
    const searchInput = document.querySelector(".search-bar input");
    let searchTimeout;

    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                // 這裡添加搜尋邏輯
                console.log("搜尋:", e.target.value);
            }, 500);
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

    // 返回頂部按鈕
    const backToTop = document.createElement("button");
    backToTop.innerHTML = "↑";
    backToTop.className = "back-to-top";
    backToTop.style.display = "none";
    document.body.appendChild(backToTop);

    window.addEventListener("scroll", () => {
        if (window.pageYOffset > 300) {
            backToTop.style.display = "block";
        } else {
            backToTop.style.display = "none";
        }
    });

    backToTop.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
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

    // 創建導航點
    slides.forEach((_, index) => {
        const dot = document.createElement("button");
        dot.classList.add("carousel-dot");
        if (index === 0) dot.classList.add("active");
        dotsContainer.appendChild(dot);
    });

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

    // 導航點事件
    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            updateCarousel(index);
            resetAutoplay();
        });
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
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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
    updateUIAfterLogin(email);
    closeModal();
}

function handleLogout() {
    localStorage.removeItem("loggedInEmail");
    location.reload();
}

function handleSearch() {
    const query = document.querySelector(".search-bar input").value;
    alert(`搜尋: ${query}`);
}

function updateUIAfterLogin(email) {
    document.querySelector(".btn-login").style.display = "none";
    document.querySelector(".btn-register").style.display = "none";
    document.querySelector(".user-email-container").style.display = "flex";
    document.querySelector(".user-email").textContent = email;
    document.querySelector(".cart-container").style.display = "flex";
    document.querySelector(".notifications-container").style.display = "flex";
}

document.addEventListener("click", function (event) {
    const notificationsDropdown = document.querySelector(
        ".notifications-dropdown"
    );
    const cartDropdown = document.querySelector(".cart-dropdown");
    if (
        !event.target.closest(".btn-notifications") &&
        !event.target.closest(".notifications-dropdown")
    ) {
        notificationsDropdown.classList.remove("active");
    }
    if (
        !event.target.closest(".btn-cart") &&
        !event.target.closest(".cart-dropdown")
    ) {
        cartDropdown.classList.remove("active");
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const loggedInEmail = localStorage.getItem("loggedInEmail");
    if (loggedInEmail) {
        updateUIAfterLogin(loggedInEmail);
    }
});
window.onload = function () {
    if (localStorage.getItem("showLoginModal") === "true") {
        showLoginPopup();
        localStorage.removeItem("showLoginModal"); // 移除標記，避免刷新時再次彈出
    }
};

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

// 檢查使用者是否登入
function isLoggedIn() {
    return document.body.dataset.userLoggedIn === "true";
}
// 自訂確認框
function customConfirm(message, callback) {
    let modal = document.getElementById("custom-confirm");
    let confirmYes = document.getElementById("confirm-yes");
    let confirmNo = document.getElementById("confirm-no");

    // 設定訊息
    document.getElementById("confirm-message").innerText = message;

    // 顯示模態框
    modal.style.display = "flex";

    // 先移除舊的事件監聽，避免重複觸發
    confirmYes.onclick = null;
    confirmNo.onclick = null;

    // 點擊確定
    confirmYes.onclick = function () {
        modal.style.display = "none";
        callback(true);
    };

    // 點擊取消
    confirmNo.onclick = function () {
        modal.style.display = "none";
        callback(false);
    };
}

// 替換原本的 confirm()
function promptLogin(event) {
    event.preventDefault(); // 防止跳轉

    if (!isLoggedIn()) {
        customConfirm("您尚未登入，是否要立即登入？", function (confirmLogin) {
            if (confirmLogin) {
                openLoginModal(); // 打開登入模態框
            }
        });
    } else {
        window.location.href = event.target.href;
    }
}
// 綁定事件
document.getElementById("btn-event1").addEventListener("click", promptLogin);
document.getElementById("btn-event2").addEventListener("click", promptLogin);
document.getElementById("btn-event3").addEventListener("click", promptLogin);
document.getElementById("btn-venue1").addEventListener("click", promptLogin);
document.getElementById("btn-venue2").addEventListener("click", promptLogin);
document.getElementById("btn-venue3").addEventListener("click", promptLogin);
document.getElementById("btn-match").addEventListener("click", promptLogin);

