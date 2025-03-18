//日曆
document.addEventListener("DOMContentLoaded", () => {
    const monthYear = document.getElementById("monthYear");
    const calendarDays = document.querySelector(".calendar-days");
    const prevMonth = document.getElementById("prevMonth");
    const nextMonth = document.getElementById("nextMonth");

    let date = new Date();
    let currentYear = date.getFullYear();
    let currentMonth = date.getMonth();

    function renderCalendar() {
        calendarDays.innerHTML = "";
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
        const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        monthYear.textContent = `${currentYear}年 ${currentMonth + 1}月`;

        // 添加空白占位符
        for (let i = 0; i < firstDayOfMonth; i++) {
            const emptyCell = document.createElement("div");
            calendarDays.appendChild(emptyCell);
        }

        // 填充日期
        for (let day = 1; day <= totalDaysInMonth; day++) {
            const dayElement = document.createElement("div");
            dayElement.textContent = day;

            let dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

            // 標記今天
            if (
                day === date.getDate() &&
                currentMonth === date.getMonth() &&
                currentYear === date.getFullYear()
            ) {
                dayElement.classList.add("today");
            }

            // 標記重要日期
            if (markedDates.includes(dateString)) {
                dayElement.classList.add("marked");
            }

            calendarDays.appendChild(dayElement);
        }
    }

    prevMonth.addEventListener("click", () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar();
    });

    nextMonth.addEventListener("click", () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar();
    });

    renderCalendar();
});
//日曆區跟隨滑鼠滾動

//倒數計時器
document.addEventListener("DOMContentLoaded", function () {
    var countdownElements = document.querySelectorAll(".countdown");

    function updateCountdown() {
        var now = new Date().getTime();

        countdownElements.forEach(function (element) {
            var targetTime = parseInt(element.getAttribute("data-target-time"), 10);
            var distance = targetTime - now;

            if (distance <= 0) {
                element.innerHTML = "賽事逾期";
                return;
            }
            //運算式
            var days = Math.floor(distance / (1000 * 60 * 60 * 24));
            var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);
            //缺項補零
            days = String(days).padStart(2, '0');
            hours = String(hours).padStart(2, '0');
            minutes = String(minutes).padStart(2, '0');
            seconds = String(seconds).padStart(2, '0');

            element.innerHTML = days + "天 " + hours + "小時 " + minutes + "分 " + seconds + "秒";
        });
    }

    // 每秒更新一次
    setInterval(updateCountdown, 1000);
    updateCountdown();
});

//資料換頁功能
document.addEventListener("DOMContentLoaded", function () {
    console.log("Event.js 成功載入！");

    const itemsPerPage = 5; // 每頁顯示的賽事數量
    let currentPage = 1;
    const eventsContainer = document.getElementById("events-container");
    const paginationContainer = document.getElementById("MyPagination");
    const eventItems = Array.from(document.querySelectorAll(".event-item"));
    const totalPages = Math.ceil(eventItems.length / itemsPerPage);

    function renderPagination() {
        paginationContainer.innerHTML = ""; // 先清空按鈕

        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement("button");
            btn.innerText = i;
            btn.classList.add("page-btn");
            if (i === currentPage) btn.classList.add("active");

            btn.addEventListener("click", function () {
                console.log("按下按鈕：" + i);
                currentPage = i;
                updatePagination();
            });

            paginationContainer.appendChild(btn);
        }

        paginationContainer.style.display = "flex"; // 確保按鈕區塊顯示
    }
    function updatePagination() {
        console.log("執行 updatePagination，當前頁面：" + currentPage);
        eventItems.forEach((item, index) => {
            let shouldShow = index >= (currentPage - 1) * itemsPerPage && index < currentPage * itemsPerPage;
            console.log("項目 " + index + " 是否顯示：" + shouldShow);

            if (shouldShow) {
                item.style.display = "flex"; // 確保 `event-item` 顯示時保持 `flex`
            } else {
                item.style.display = "none"; // 隱藏其他項目
            }
        });

        renderPagination();
    }

    window.updatePagination = updatePagination; // 確保全域可存取

    updatePagination(); // 頁面載入時執行
});

    //輪播圖
    const track = document.querySelector('.EventCarousel-track');
    const prevButton = document.querySelector('.EventCarousel-button.prev');
    const nextButton = document.querySelector('.EventCarousel-button.next');
    const items = document.querySelectorAll('.EventCarousel-item');
    const indicators = document.querySelectorAll('.EventIndicator');

    let currentIndex = 0;

    // 更新畫廊顯示和指示器樣式
    function updateCarousel() {
        const itemWidth = items[0].clientWidth;
        track.style.transform = `translateX(-${currentIndex * itemWidth}px)`;

        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
        });
    }
    // 下一張圖片
    nextButton.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % items.length;
        updateCarousel();
    });
    // 上一張圖片
    prevButton.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        updateCarousel();
    });
    // 點擊指示器跳轉到對應圖片
    indicators.forEach((indicator) => {
        indicator.addEventListener('click', () => {
            currentIndex = parseInt(indicator.getAttribute('data-index'));
            updateCarousel();
        });
    });
    //輪播秒數設定
    setInterval(() => {
        nextButton.click();
    }, 8000);
    updateCarousel();

