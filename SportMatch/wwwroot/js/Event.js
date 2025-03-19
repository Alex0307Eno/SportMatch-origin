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
//寫jquery在原頁面
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
//報名特效
document.addEventListener("DOMContentLoaded", function () {
    // 選取所有 class 為 join-btn 的按鈕
    document.querySelectorAll(".join-btn").forEach(function (button) {
        button.addEventListener("mouseover", function () {
            this.innerText = "快點擊我";
        });

        button.addEventListener("mouseout", function () {
            this.innerText = "立即報名";
        });
    });
});
//資料換頁功能
document.addEventListener("DOMContentLoaded", function () {
    console.log("Event.js 成功載入！");

    const itemsPerPage = 3; // 每頁顯示的賽事數量
    let currentPage = 1;
    const eventsContainer = document.getElementById("events-container");
    const paginationContainer = document.getElementById("MyPagination");
    const eventItems = Array.from(document.querySelectorAll(".event-item"));
    const totalPages = Math.ceil(eventItems.length / itemsPerPage);
    function renderPagination() {
        paginationContainer.innerHTML = ""; // 先清空按鈕

        const totalVisibleButtons = 7; // 固定按鈕顯示數量，包括 `...`

        // 建立「上一頁」按鈕
        const prevBtn = document.createElement("button");
        prevBtn.innerText = "« 上一頁";
        prevBtn.classList.add("page-btn", "prev-btn");
        prevBtn.disabled = currentPage === 1;
        prevBtn.addEventListener("click", function () {
            if (currentPage > 1) {
                currentPage--;
                updatePagination();
            }
        });
        paginationContainer.appendChild(prevBtn);

        // ✅ 修正邏輯，處理當 totalPages < 7 的情況
        let startPage, endPage;

        if (totalPages < 7) {
            // ✅ 如果總頁數小於 7，直接顯示所有頁碼，沒有 `...`
            startPage = 1;
            endPage = totalPages;
        } else {
            // ✅ 原本的邏輯，當總頁數大於等於 7 才使用 `...`
            if (currentPage <= 3) {
                startPage = 1;
                endPage = 5;
            } else if (currentPage >= totalPages - 2) {
                startPage = totalPages - 4;
                endPage = totalPages;
            } else {
                startPage = currentPage - 1;
                endPage = currentPage + 1;
            }
        }

        if (startPage > 1) {
            addPageButton(1);
            if (startPage > 2) addEllipsis();
        }

        for (let i = startPage; i <= endPage; i++) {
            addPageButton(i);
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) addEllipsis();
            addPageButton(totalPages);
        }

        // 建立「下一頁」按鈕
        const nextBtn = document.createElement("button");
        nextBtn.innerText = "下一頁 »";
        nextBtn.classList.add("page-btn", "next-btn");
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.addEventListener("click", function () {
            if (currentPage < totalPages) {
                currentPage++;
                updatePagination();
            }
        });
        paginationContainer.appendChild(nextBtn);

        // ✅ 先移除舊的 "共 xx 筆資料"
        const oldTotalRecords = document.querySelector(".total-records");
        if (oldTotalRecords) {
            oldTotalRecords.remove();
        }

        // ✅ 新增「共 xx 筆資料」的顯示區塊
        const totalRecordsText = document.createElement("span");
        totalRecordsText.innerText = `共 ${eventItems.length} 筆資料`;
        totalRecordsText.classList.add("total-records");

        // ✅ 放到「下一頁」按鈕的右邊
        paginationContainer.appendChild(totalRecordsText);
    }

    //新增頁碼按鈕的函式
    function addPageButton(page) {
        const btn = document.createElement("button");
        btn.innerText = page;
        btn.classList.add("page-btn");
        if (page === currentPage) btn.classList.add("active");

        btn.addEventListener("click", function () {
            currentPage = page;
            updatePagination();
        });

        paginationContainer.appendChild(btn);
    }
    //新增省略號 (...) 按鈕
    function addEllipsis() {
        const ellipsis = document.createElement("span");
        ellipsis.innerText = "...";
        ellipsis.classList.add("ellipsis");
        paginationContainer.appendChild(ellipsis);
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

