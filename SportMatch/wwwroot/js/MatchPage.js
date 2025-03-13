// 選取另一個父分類時取消選擇底下子分類
$("input[name='MatchCategory']").change(function () {
    $(".MatchCheckBoxItem").prop("checked", false);
});

// 更新模態視窗內容
function updateInfoModalContent(playerName, playerPosition, imgSrc) {
    document.getElementById('modal-player-name').innerText = playerName;
    document.getElementById('modal-player-position').innerText = ("擅長位置：" + playerPosition);
    document.getElementById('playerImg').src = imgSrc;
}
function updateApplyModalContent(playerName, playerPosition) {
    document.getElementById('modal-apply-name').innerText = playerName;
    document.getElementById('modal-apply-position').innerText = ("擅長位置：" + playerPosition);
}

// 加入最愛功能
function addToMyFavorite() {
    var dom = document.getElementById('heartIcon');
    var toa = document.getElementById('toastMessage');
    var toast = new bootstrap.Toast(document.getElementById("heartToast"));
    if (dom.classList.contains("bi-heart")) {
        dom.classList.toggle("bi-heart");
        dom.classList.toggle("bi-heart-fill");
        dom.style.color = "pink";
        toa.innerHTML = "已加入收藏"
        // alert("已加入收藏");
    }
    else {
        dom.classList.toggle("bi-heart");
        dom.classList.toggle("bi-heart-fill");
        dom.style.color = "white";
        toa.innerHTML = "已取消收藏"
        // alert("已取消收藏");
    }
    toast.show();
}

// 初始化載入第一頁
$(document).ready(function () {
    loadCards(1);
    getRole();
    loadEvent();
});

// 載入獲得賽事資料
function loadEvent() {
    $.ajax({
        url: "/Match/GetEvent",  // 呼叫後端 Controller
        type: "GET",
        success: function (response) {
            $("#badmintonEventList").empty(); // 清空舊的賽事
            $("#basketballEventList").empty(); // 清空舊的賽事
            $("#valleyballEventList").empty(); // 清空舊的賽事
            console.log(response);
            response.badmintonEventList.forEach(x => {
                $("#badmintonEventList").append(`
                    <label class="col-6">
	                    <input type="checkbox" id="${x}" name="MatchEvent" value="${x}" class="MatchCheckBoxItem me-1" style="cursor:pointer">
	                    <label for="${x}" style="cursor:pointer">${x}</label>
                    </label>
                    <br>
                    `)
            })
            response.basketballEventList.forEach(x => {
                $("#basketballEventList").append(`
                    <label class="col-6">
	                    <input type="checkbox" id="${x}" name="MatchEvent" value="${x}" class="MatchCheckBoxItem me-1" style="cursor:pointer">
	                    <label for="${x}" style="cursor:pointer">${x}</label>
                    </label>
                    <br>
                    `)
            })
            response.valleyballEventList.forEach(x => {
                $("#valleyballEventList").append(`
                    <label class="col-6">
	                    <input type="checkbox" id="${x}" name="MatchEvent" value="${x}" class="MatchCheckBoxItem me-1" style="cursor:pointer">
	                    <label for="${x}" style="cursor:pointer">${x}</label>
                    </label>
                    <br>
                    `)
            })
        },
        error: function () {
            alert("請求失敗，請稍後再試");
        }
    });
}

// 動態切換運動位置
function getRole() {
    $("input[name='MatchCategory']").change(function () {
        var selectedSport = $(this).val(); // 獲取選中的值
        $.ajax({
            url: "/Match/GetRole",  // 呼叫後端 Controller
            type: "GET",
            data: { selectedSport: selectedSport },
            success: function (response) {
                $("#RoleContainer").empty(); // 清空舊的角色列表
                console.log(response);
                response.roleList.forEach(x => {
                    $("#RoleContainer").append(`
                    <label class="col-6">
						<input type="checkbox" id="${x}" name="MatchRole" value="${x}" class="MatchCheckBoxItem me-1" style="cursor:pointer">
                        <label for="${x}" style="cursor:pointer">${x}</label>
					</label><br>
                    `)
                })
            },
            error: function () {
                alert("請求失敗，請稍後再試");
            }
        });
    });
}




// 一頁顯示幾個Card
const pageSize = 6;

// 動態載入卡片
function loadCards(page) {
    $.ajax({
        url: "/Match/GetCards",
        type: "GET",
        data: { page: page, pageSize: pageSize },
        success: function (response) {
            console.log(response);
            const cardContainer = $("#CardContainer");
            cardContainer.empty();
            response.cards.forEach(card => {
                cardContainer.append(`
                 <div class="col-md-6 mb-3">
                     <div class="card mb-3 " style="max-width: 540px;">
                         <div class="row g-0">
                             <div class="col-md-4">
	                                <img src="${card.image}" class="img-fluid rounded-start" alt="...">
                             </div>
                             <div class="col-md-8">
	                                <div class="card-body">
		                                <p class="card-title" style="font-size:x-large">${card.name}</p>
		                                <hr/>
		                                <p class="card-text">擅長位置：${card.role}</p>
		                                <div class="row">
			                                <div class="col-md-8 d-flex align-items-center">
				                                <label class="card-text">個人簡介</label>
				                                <a id="personalInfo" class="bi bi-info-square ms-2"
				                                   style="color: white;cursor: pointer;" data-bs-toggle="modal"
				                                   data-bs-target="#playerModal"
				                                   onclick="updateInfoModalContent('${card.name}','${card.role}','${card.image}')"></a>
			                                </div>
			                                <div class="col-md-4">
				                                <a href="#" class="btn btn-primary" style="border-radius: 60px;"
				                                   data-bs-toggle="modal" data-bs-target="#playerApply"
				                                   onclick="updateApplyModalContent('${card.name}','${card.role}')">招募</a>
			                                </div>
		                                </div>
	                                </div>
                             </div>
                         </div>
                     </div>
                 </div>
                 `);
            });

            updatePagination(response.totalPages, page, response.totalItems);
        }
    });
}

// 分頁功能
function updatePagination(totalPages, activePage, totalItems) {
    $("#paginationInfo").text(`當前第 ${activePage} 頁 ，總共 ${totalItems} 筆資料`);
    const pagination = $("#pagination");
    pagination.empty();

    let prevDisabled = activePage === 1 ? "disabled" : "";
    let nextDisabled = activePage === totalPages ? "disabled" : "";

    pagination.append(`
        <li class="page-item ${prevDisabled}">
            <a class="page-link " href="#" onclick="loadCards(${activePage - 1}); return false;">
                <span aria-hidden="true">&laquo;</span>
            </a>
        </li>
        <li class="page-item active" style="z-index:0;">
            <span class="page-link" style="background-color: #212121;border: 1px solid #00ADB5;">${activePage} / ${totalPages}</span>
        </li>
        <li class="page-item ${nextDisabled}">
            <a class="page-link" href="#" onclick="loadCards(${activePage + 1}); return false;">
                <span aria-hidden="true">&raquo;</span>
            </a>
        </li>
    `);
}
