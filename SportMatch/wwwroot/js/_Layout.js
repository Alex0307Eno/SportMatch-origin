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
// 檢查用戶是否登入
function isLoggedIn() {
    return localStorage.getItem("isLoggedIn") === "true";
}

// 用戶未登入時，詢問是否要登入
function promptLogin(event) {
    event.preventDefault(); // 防止跳轉

    if (!isLoggedIn()) {
        let confirmLogin = confirm("您尚未登入，是否要立即登入？");
        if (confirmLogin) {
            openLoginModal(); // 打開登入模態框（假設已經有這個函式）
        }
    } else {
        // 如果已登入，正常跳轉
        window.location.href = event.target.href;
    }
}

// 為「配對系統」和「賽事資訊」添加事件監聽器
document.getElementById("matchingLink").addEventListener("click", promptLogin);
document.getElementById("eventsLink").addEventListener("click", promptLogin);


document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("loginModal");

    modal.addEventListener("click", function (e) {
        if (e.target === modal) {
            closeModal();
        }
    });
});

const passwordField = document.getElementById('password'); // 確保 ID 與 HTML 一致
const togglePasswordButton = document.querySelector('.toggle-password'); // 綁定 button
const toggleIcon = document.getElementById('Pwhide'); // 綁定 icon

togglePasswordButton.addEventListener('click', function () {
    // 切換 input 的 type 屬性
    const type = passwordField.type === 'password' ? 'text' : 'password';
    passwordField.type = type;

    // 切換 icon 圖示
    toggleIcon.setAttribute('name', type === 'password' ? 'lock-closed' : 'lock-open-outline');
});

