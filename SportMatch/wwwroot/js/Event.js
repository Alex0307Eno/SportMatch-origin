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
//收疊功能
