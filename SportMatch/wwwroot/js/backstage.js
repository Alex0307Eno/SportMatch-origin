document.addEventListener("DOMContentLoaded", function () {
    const tabButtons = document.querySelectorAll(".tab-button");
    const tabContents = document.querySelectorAll(".tab-content");

    // 切換標籤頁
    tabButtons.forEach((button) => {
        button.addEventListener("click", function () {
            // 移除所有標籤頁的 active 類別
            tabButtons.forEach((btn) => btn.classList.remove("active"));
            tabContents.forEach((content) => content.classList.remove("active"));

            // 為當前點擊的按鈕添加 active 類別
            this.classList.add("active");

            // 顯示對應的內容
            const target = this.getAttribute("data-target");
            document.getElementById(target).classList.add("active");
        });
    });
});
document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("search-input");
    const searchButton = document.getElementById("search-btn");
    const tableRows = document.querySelectorAll("tbody tr");

    searchButton.addEventListener("click", function () {
        const searchTerm = searchInput.value.trim().toLowerCase();

        tableRows.forEach((row) => {
            const orderId = row.cells[0].textContent.toLowerCase();
            const itemName = row.cells[1].textContent.toLowerCase();

            if (orderId.includes(searchTerm) || itemName.includes(searchTerm)) {
                row.style.display = "table-row";
            } else {
                row.style.display = "none";
            }
        });
    });

    searchInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            searchButton.click();
        }
    });
});

document.querySelectorAll(".category-btn").forEach((button) => {
    button.addEventListener("click", function () {
        // 移除所有按鈕的 active 類別
        document
            .querySelectorAll(".category-btn")
            .forEach((btn) => btn.classList.remove("active"));

        // 為當前按鈕添加 active 類別
        this.classList.add("active");

        // 隱藏所有運動類別的內容
        document
            .querySelectorAll(".category-item")
            .forEach((item) => item.classList.remove("active"));

        // 顯示當前按鈕對應的內容
        const category = this.getAttribute("data-category");
        document.getElementById(category).classList.add("active");
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const tabs = document.querySelectorAll(".sidebar nav ul li");
    const contentSections = document.querySelectorAll(".tab-content");

    tabs.forEach((tab) => {
        tab.addEventListener("click", function () {
            // 移除所有 tabs 的 active 類
            tabs.forEach((item) => item.classList.remove("active"));
            // 為當前點擊的 tab 添加 active 類
            tab.classList.add("active");

            // 隱藏所有內容區域
            contentSections.forEach((section) => section.classList.remove("active"));

            // 顯示對應的內容區域
            const targetId = tab.getAttribute("data-target");
            const targetSection = document.getElementById(targetId);
            targetSection.classList.add("active");
        });
    });
});

// 切換 Tab 顯示
function switchTab(tabName) {
    // 隱藏所有的 tab-content
    const allTabs = document.querySelectorAll(".tab-content");
    allTabs.forEach((tab) => tab.classList.remove("active"));

    // 顯示選中的 tab
    const selectedTab = document.getElementById(tabName);
    selectedTab.classList.add("active");

    // 更新側邊欄的選中狀態
    const allSidebarItems = document.querySelectorAll(".sidebar ul li");
    allSidebarItems.forEach((item) => item.classList.remove("active"));
    const selectedItem = document.querySelector(
        `.sidebar ul li[data-target="${tabName}"]`
    );
    selectedItem.classList.add("active");
}

// 頁面加載時預設顯示商品管理的已上架商品
window.onload = function () {
    switchTab("product-management");
    // 初始化已上架商品
    switchTab("order-history");
};

document.addEventListener("DOMContentLoaded", function () {
    // 確保頁面加載時，顯示已上架商品區
    document.getElementById("order-history").style.display = "block";
    document.getElementById("match-history").style.display = "none";

    // 點擊商品管理時顯示已上架商品
    document
        .querySelector("[data-target='product-management']")
        .addEventListener("click", function () {
            document.getElementById("order-history").style.display = "block";
            document.getElementById("match-history").style.display = "none";
        });

    // 點擊訂單管理時顯示訂單紀錄
    document
        .querySelector("[data-target='order-management']")
        .addEventListener("click", function () {
            document.getElementById("order-history").style.display = "block";
            document.getElementById("match-history").style.display = "none";
        });

    // 點擊不同的標籤（例如 已上架、待審核）進行切換
    const tabButtons = document.querySelectorAll(".tab-button");
    tabButtons.forEach((button) => {
        button.addEventListener("click", function () {
            tabButtons.forEach((b) => b.classList.remove("active"));
            this.classList.add("active");

            const target = this.getAttribute("data-target");
            if (target === "order-history") {
                document.getElementById("order-history").style.display = "block";
                document.getElementById("match-history").style.display = "none";
            } else if (target === "match-history") {
                document.getElementById("order-history").style.display = "none";
                document.getElementById("match-history").style.display = "block";
            }
        });
    });
});

function switchTab(target) {
    // 先隱藏所有區域
    const allSections = document.querySelectorAll(".section-content");
    allSections.forEach((section) => {
        section.style.display = "none";
    });

    // 顯示對應的區域
    const targetSection = document.getElementById(target);
    if (targetSection) {
        targetSection.style.display = "block";
    }

    // 更新 Tab 樣式
    const tabButtons = document.querySelectorAll(".tab-button");
    tabButtons.forEach((button) => {
        button.classList.remove("active");
    });

    const activeButton = document.querySelector(
        `.tab-button[data-target="${target}"]`
    );
    if (activeButton) {
        activeButton.classList.add("active");
    }
}

// 初始時顯示商品管理
document.addEventListener("DOMContentLoaded", function () {
    switchTab("product-management");
});
