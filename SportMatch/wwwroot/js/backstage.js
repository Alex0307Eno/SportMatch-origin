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
    const header = document.getElementById("header"); // 這是 header 元素

    tabs.forEach((tab) => {
        tab.addEventListener("click", function () {
            // 移除所有 tabs 的 active 類
            tabs.forEach((item) => item.classList.remove("active"));
            // 為當前點擊的 tab 添加 active 類
            tab.classList.add("active");

            // 隱藏所有內容區域
            contentSections.forEach((section) => section.classList.remove("active"));

            // 檢查是否選擇了會員管理區，並隱藏 header 和其他區域
            const targetId = tab.getAttribute("data-target");
            const targetSection = document.getElementById(targetId);
            targetSection.classList.add("active");

            if (targetId === "member-management") {
                // 隱藏 header 和已上架、待審核的部分
                if (header) header.style.display = "none"; // 隱藏 header
                document.getElementById("order-history").style.display = "none"; // 隱藏已上架
                document.getElementById("match-history").style.display = "none"; // 隱藏待審核
            } else {
                // 顯示 header 和已上架、待審核部分
                if (header) header.style.display = "block"; // 顯示 header
            }
        });
    });
});

// 修改 switchTab 函數，以便在選擇 member-management 時隱藏其他區域
function switchTab(tabName) {
    // 隱藏所有的 tab-content
    const allTabs = document.querySelectorAll(".tab-content");
    allTabs.forEach((tab) => tab.classList.remove("active"));

    // 顯示選中的 tab
    const selectedTab = document.getElementById(tabName);
    selectedTab.classList.add("active");

    // 隱藏 header 和已上架、待審核區域
    const header = document.getElementById("header");
    if (tabName === "member-management") {
        if (header) header.style.display = "none"; // 隱藏 header
        document.getElementById("order-history").style.display = "none"; // 隱藏已上架
        document.getElementById("match-history").style.display = "none"; // 隱藏待審核
    } else {
        if (header) header.style.display = "block"; // 顯示 header
    }

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
            } else {
                document.getElementById("order-history").style.display = "none";
                document.getElementById("match-history").style.display = "none";
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

// 初始時顯示會員管理
document.addEventListener("DOMContentLoaded", function () {
    switchTab("member-management");
});


window.onload = function () {
    // 頁面加載時，隱藏 header 和已上架、待審核區域
    document.getElementById("header").style.display = "none"; // 隱藏 header
    document.getElementById("order-history").style.display = "none"; // 隱藏已上架
    document.getElementById("match-history").style.display = "none"; // 隱藏待審核

    // 預設顯示商品管理的已上架商品
    switchTab("product-management");
};

document.addEventListener("DOMContentLoaded", function () {
    // 確保頁面加載時，隱藏 header 和已上架、待審核區域
    document.getElementById("header").style.display = "none"; // 隱藏 header
    document.getElementById("order-history").style.display = "none"; // 隱藏已上架
    document.getElementById("match-history").style.display = "none"; // 隱藏待審核
});
let userInfo = localStorage.getItem("loggedInEmail");

if (userInfo) {
    fetch("/Back/ReceiveLocalStorage", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userInfo), // 傳送資料
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log("資料已成功接收", data.userName);

                // 將 userName 顯示在網頁上
                document.getElementById("userNameDisplay").textContent = `歡迎，${data.userName}`;
            } else {
                console.log("資料接收失敗", data.message);
            }
        })
        .catch(error => {
            console.error("錯誤:", error);
        });
}
document.addEventListener("DOMContentLoaded", function () {

    // 篩選條件選項
    const filterOptions = [
        { value: "all", label: "所有" },
        { value: "使用者", label: "使用者" },
        { value: "廠商", label: "廠商" },
        { value: "管理員", label: "管理員" }
    ];

    // 取得篩選下拉選單元素
    const paymentMethodSelect = document.getElementById("payment-method");

    // 動態填充篩選選項
    filterOptions.forEach(option => {
        const optionElement = document.createElement("option");
        optionElement.value = option.value;
        optionElement.textContent = option.label;
        paymentMethodSelect.appendChild(optionElement);
    });

    // 先從後端獲取所有的會員資料
    fetch("/Back/GetUsers")
        .then(response => response.json())
        .then(data => {
            const tbody = document.querySelector("#member-management tbody");
            tbody.innerHTML = ""; // 清空表格內容

            // 渲染會員資料到表格
            data.forEach(user => {
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${user.identity}</td>
                    <td>${user.userId}</td>
                    <td>${user.userName}</td>
                    <td>${user.email}</td>
                    <td>${user.guiCode || "無"}</td>
                    <td>${user.createdAt}</td>
                    <td>
                        <button class="delete-btn" data-id="${user.userId}">刪除</button>
                    </td>
                `;

                tbody.appendChild(row);
            });

            // 綁定刪除按鈕事件
            document.querySelectorAll(".delete-btn").forEach(button => {
                button.addEventListener("click", function () {
                    const userId = this.getAttribute("data-id");
                    deleteUser(userId);
                });
            });

            // 篩選功能
            paymentMethodSelect.addEventListener("change", function () {
                const selectedMethod = this.value;
                console.log("Selected Method: ", selectedMethod);  // 用來檢查選擇的篩選條件
                filterTable(selectedMethod, data);
            });

            // 初始載入顯示所有會員
            filterTable('all', data);

        })
        .catch(error => console.error("獲取會員資料失敗:", error));

    // 篩選資料表格
    function filterTable(selectedMethod, data) {
        const tbody = document.querySelector("#member-management tbody");
        tbody.innerHTML = ""; // 清空表格內容

        console.log("Selected Method:", selectedMethod); // 打印 selectedMethod
        console.log("Data:", data); // 打印資料結構

        let filteredData = [...data]; // 複製資料以便篩選

        if (selectedMethod !== 'all') {
            filteredData = filteredData.filter(user => {
                console.log("Comparing:", user.identity, selectedMethod); // 打印每個過濾的條件
                return user.identity === selectedMethod;
            });
        }

        console.log('Filtered Data:', filteredData); // 打印過濾後的資料

        if (filteredData.length === 0) {
            console.log("沒有符合篩選條件的資料");
        }

        filteredData.forEach(user => {
            const row = document.createElement("tr");

            row.innerHTML = `
        <td>${user.identity}</td>
        <td>${user.userId}</td>
        <td>${user.userName}</td>
        <td>${user.email}</td>
        <td>${user.guiCode || "無"}</td>
        <td>${user.createdAt}</td>
        <td>
            <button class="delete-btn" data-id="${user.userId}">刪除</button>
        </td>
    `;

            tbody.appendChild(row);
        });

        // 綁定刪除按鈕事件
        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", function () {
                const userId = this.getAttribute("data-id");
                deleteUser(userId);
            });
        });
    }




    // 刪除會員函數

    function deleteUser(userId) {
        if (confirm("確定要刪除此會員嗎？")) {
            fetch(`/Back/DeleteUser/${userId}`, { method: "DELETE" })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert("會員已刪除");
                        location.reload(); // 重新載入頁面
                    } else {
                        alert("刪除失敗：" + data.message);
                    }
                })
                .catch(error => console.error("刪除失敗:", error));
        }
    }
});

