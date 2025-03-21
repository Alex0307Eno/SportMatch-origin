// 初始化載入第一頁
$(document).ready(function () {
    getRole();
    loadEvent()
    matchTypeChangeOrNot();
    checkEventOrNot();
    //getUserInfoFromlocalStorage()
    getSelectionCard(1)
    if (!sessionStorage.getItem("hasRunUserInfo")) {
        getUserInfoFromlocalStorage();
        sessionStorage.setItem("hasRunUserInfo", "true"); // **設定標記，確保只執行一次**
    }
    getApply()
    ExpandAccordion()
});

// 從localStorage獲取使用者的資訊
function getUserInfoFromlocalStorage() {
    let userInfo = localStorage.getItem("loggedInEmail"); // 取得 localStorage內user的email
    console.log(userInfo);
    if (userInfo) {
        $.ajax({
            url: "/Match/ReceiveLocalStorage", // 後端 Controller 的 API 路徑
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(userInfo), // 傳遞 JSON 格式
            success: function (response) {
                console.log("後端回應:", response);
                loadCards(1);
            },
            error: function (xhr, status, error) {
                console.error("發送失敗:", error);
            }
        });
    }
}

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
	                    <input type="checkbox" id="${x}" name="MatchEvent" value="${x}" class="MatchCheckBoxItem me-1 mt-2 forCheckEvent" style="cursor:pointer" onselect="checkEventOrNot()">
	                    <label for="${x}" style="cursor:pointer">${x}</label>
                    </label>
                    <br>
                    `)
            })
            response.basketballEventList.forEach(x => {
                $("#basketballEventList").append(`
                    <label class="col-6">
	                    <input type="checkbox" id="${x}" name="MatchEvent" value="${x}" class="MatchCheckBoxItem me-1 mt-2 forCheckEvent" style="cursor:pointer">
	                    <label for="${x}" style="cursor:pointer">${x}</label>
                    </label>
                    <br>
                    `)
            })
            response.valleyballEventList.forEach(x => {
                $("#valleyballEventList").append(`
                    <label class="col-6">
	                    <input type="checkbox" id="${x}" name="MatchEvent" value="${x}" class="MatchCheckBoxItem me-1 mt-2 forCheckEvent" style="cursor:pointer">
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

// 
function ExpandAccordion() {
    $(".forCheckCategory").on('click', function () {
        $("#Area").addClass("show");
        $("#Role").addClass("show");
    })
}


// 切換配對類型更新篩選列
function matchTypeChangeOrNot() {
    $("input[name='MatchType']").on('change', function () {
        $("input[name='MatchCategory']").prop("checked", false);
        $("input[name='MatchArea']").prop("checked", false);
        $(".accordion .collapse").collapse('hide');

        // 當 radioOption1 被選中時，清空賽事列表
        if ($("#radioOption1").is(":checked")) {
            $(".forCheckCategory").removeAttr("data-bs-toggle");
            //$(".MatchCheckBoxItem").prop("checked", false);
            $('.forCheckArea').prop('disabled', false);
            $("#RoleContainer").empty();
            $("#badmintonEventList").empty();
            $("#basketballEventList").empty();
            $("#valleyballEventList").empty();
        } else if ($("#radioOption2").is(":checked")) {
            $(".forCheckCategory").attr("data-bs-toggle", "collapse");
            // 當 radioOption2 被選中時，執行 loadEvent()
            loadEvent();
        }
    });
}

// 選取運動分類時取消選擇底下賽事選項
$("input[name='MatchCategory']").on('change', function () {
    $(".MatchCheckBoxItem").prop("checked", false);
});

// 若選取賽事則調整篩選條件
function checkEventOrNot() {
    $(document).on('change', '.forCheckEvent', function () {
        const anyChecked = $('.forCheckEvent:checked').length > 0; // 檢查是否有勾選

        // 控制區域按鈕
        $('.forCheckArea').prop('disabled', anyChecked);

        if (anyChecked) {
            $('.forCheckArea').prop('checked', !anyChecked);
        }
        else {
            $('.forCheckArea').prop('checked', anyChecked);
        }
    });
}

// 動態切換運動位置
function getRole() {
    $("input[name='MatchCategory']").on('change', function () {
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
						<input type="checkbox" id="${x}" name="MatchRole" value="${x}" class="MatchCheckBoxItem me-1 mt-2 forCheckRole" style="cursor:pointer">
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

// 一頁顯示幾個Card
const pageSize = 6;

// 動態載入推薦卡片
function loadCards(page) {
    $.ajax({
        url: "/Match/GetCards",
        type: "GET",
        data: { page: page, pageSize: pageSize },
        success: function (response) {
            console.log(response);
            const cardContainer = $("#CardContainer");
            const playerModalLabel = $("#playerModalLabel");
            const applyModalLabel = $("#applyModalLabel");
            cardContainer.empty();
            // 判斷回傳的是User還是Team          
            playerModalLabel.text("隊伍簡介");
            applyModalLabel.text("申請確認");
            type = "Team";
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
		                                <p class="card-text">招募位置：${card.role}</p>
		                                <div class="row">
			                                <div class="col-md-8 d-flex align-items-center">
				                                <label class="card-text Memo" >隊伍簡介</label>
				                                <a id="personalInfo" class="bi bi-info-square ms-2"
				                                   style="color: white;cursor: pointer;" data-bs-toggle="modal"
				                                   data-bs-target="#playerModal"
				                                   onclick="updateInfoModalContent('${card.name}','${card.role}','${card.image}','${card.memo}','${type}')"></a>
			                                </div>
			                                <div class="col-md-4">
				                                <a href="#" class="btn"
				                                   data-bs-toggle="modal" data-bs-target="#playerApply"
				                                   onclick="updateApplyModalContent('${card.name}','${card.role}','${type}')">申請</a>
			                                </div>
		                                </div>
	                                </div>
                             </div>
                         </div>
                     </div>
                 </div>
                 `);
            });
            updatePagination(response.totalPages, page, response.totalItems, "loadCard");
        }
    });
}

// 篩選動態回傳卡片
function getSelectionCard(page) {
    $("#filterForm").on('submit', function (event) {
        event.preventDefault(); // 阻止表單預設提交


        var formData = $(this).serializeArray();
        var data = {};

        formData.forEach(function (item) {
            if (data[item.name]) {
                if (Array.isArray(data[item.name])) {
                    data[item.name].push(item.value);
                } else {
                    data[item.name] = [data[item.name], item.value];
                }
            } else {
                data[item.name] = item.value;
            }
        });

        ["MatchRole", "MatchEvent", "MatchArea"].forEach(function (key) {
            if (!data[key]) {
                data[key] = [];
            } else if (!Array.isArray(data[key])) {
                data[key] = [data[key]]; // 確保單個值時仍為陣列
            }
        });

        data["Page"] = page;

        console.log(data);
        $.ajax({
            url: "/Match/GetSelection",
            type: "POST",
            contentType: 'application/json',
            data: JSON.stringify(data),
            dataType: 'json',
            success: function (response) {
                const playerModalLabel = $("#playerModalLabel");
                const applyModalLabel = $("#applyModalLabel");
                const cardContainer = $("#CardContainer");
                cardContainer.empty();
                if (response.cards.length != 0) {
                    console.log(response)
                    let type;
                    // 判斷回傳的是User還是Team
                    if (response.cards[0].userID != 0) {
                        playerModalLabel.text("個人簡介");
                        applyModalLabel.text("招募確認");
                        type = "user";
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
				                                <label class="card-text Memo" >個人簡介</label>
				                                <a id="personalInfo" class="bi bi-info-square ms-2"
				                                   style="color: white;cursor: pointer;" data-bs-toggle="modal"
				                                   data-bs-target="#playerModal"
				                                   onclick="updateInfoModalContent('${card.name}','${card.role}','${card.image}','${card.memo}','${type}')"></a>
			                                </div>
			                                <div class="col-md-4">
				                                <a href="#" class="btn"
				                                   data-bs-toggle="modal" data-bs-target="#playerApply"
				                                   onclick="updateApplyModalContent('${card.name}','${card.role}','${type}')">招募</a>
			                                </div>
		                                </div>
	                                </div>
                             </div>
                         </div>
                     </div>
                 </div>
                 `);
                        });
                    }
                    else if (response.cards[0].teamID != 0) {
                        playerModalLabel.text("隊伍簡介");
                        applyModalLabel.text("申請確認");
                        type = "Team";
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
		                                <p class="card-text">招募位置：${card.role}</p>
		                                <div class="row">
			                                <div class="col-md-8 d-flex align-items-center">
				                                <label class="card-text Memo">隊伍簡介</label>
				                                <a id="personalInfo" class="bi bi-info-square ms-2"
				                                   style="color: white;cursor: pointer;" data-bs-toggle="modal"
				                                   data-bs-target="#playerModal"
				                                   onclick="updateInfoModalContent('${card.name}','${card.role}','${card.image}','${card.memo}','${type}')"></a>
			                                </div>
			                                <div class="col-md-4">
				                                <a href="#" class="btn" 
				                                   data-bs-toggle="modal" data-bs-target="#playerApply"
				                                   onclick="updateApplyModalContent('${card.name}','${card.role}','${type}')">申請</a>
			                                </div>
		                                </div>
	                                </div>
                             </div>
                         </div>
                     </div>
                 </div>
                 `);
                        });
                    }
                    else {
                        console.log("error");
                    }
                    updatePagination(response.totalPages, page, response.totalItems, "getCard");
                }
                else {
                    console.log("error");
                    cardContainer.append(`
                    <img src="../image/MatchPage/NotFound2.gif" alt="GIF Image" style="width:40%">
                    <label class="text-light text-center" style="font-size:x-large" >抱歉，目前沒有符合的查詢結果</label>
                    `);

                    $("#paginationInfo").text(`當前第 0 頁 ，總共 0 筆資料`);
                    const pagination = $("#pagination");
                    pagination.empty();
                    pagination.append(`
                    <li class="page-item disabled">
                        <a class="page-link " href="#">          
                            <span aria-hidden="true">&laquo;</span>
                        </a>
                    </li>
                    <li class="page-item active" style="z-index:0;">
                        <span class="page-link" style="background-color: #212121;border: 1px solid #fd7e14;">0 / 0</span>
                    </li>
                    <li class="page-item disabled">
                        <a class="page-link" href="#">
                            <span aria-hidden="true">&raquo;</span>
                        </a>
                    </li>
                `);
                }
            }
        });
    });
}

// 送出篩選後切換分頁
function getSelectionCardNextPage(page) {
    $.ajax({
        url: "/Match/GetSelectionNextPage",
        type: "GET",
        data: { page: page },
        success: function (response) {
            console.log(response)
            const playerModalLabel = $("#playerModalLabel");
            const applyModalLabel = $("#applyModalLabel");
            const cardContainer = $("#CardContainer");
            cardContainer.empty();
            let type;
            // 判斷回傳的是User還是Team
            if (response.cards[0].userID != 0) {
                playerModalLabel.text("個人簡介");
                applyModalLabel.text("招募確認");
                type = "user";
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
                                    <label class="card-text Memo">個人簡介</label>
                                    <a id="personalInfo" class="bi bi-info-square ms-2"
                                       style="color: white;cursor: pointer;" data-bs-toggle="modal"
                                       data-bs-target="#playerModal"
                                       onclick="updateInfoModalContent('${card.name}','${card.role}','${card.image}','${card.memo}','${type}')"></a>
                                   </div>
                                   <div class="col-md-4">
                                    <a href="#" class="btn"
                                       data-bs-toggle="modal" data-bs-target="#playerApply"
                                       onclick="updateApplyModalContent('${card.name}','${card.role}','${type}')">招募</a>
                                   </div>
                                  </div>
                                 </div>
                             </div>
                         </div>
                     </div>
                 </div>
                 `);
                });
            }
            else if (response.cards[0].teamID != 0) {
                playerModalLabel.text("隊伍簡介");
                applyModalLabel.text("申請確認");
                type = "Team";
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
                                  <p class="card-text">招募位置：${card.role}</p>
                                  <div class="row">
                                   <div class="col-md-8 d-flex align-items-center">
                                    <label class="card-text Memo">隊伍簡介</label>
                                    <a id="personalInfo" class="bi bi-info-square ms-2"
                                       style="color: white;cursor: pointer;" data-bs-toggle="modal"
                                       data-bs-target="#playerModal"
                                       onclick="updateInfoModalContent('${card.name}','${card.role}','${card.image}','${card.memo}','${type}')"></a>
                                   </div>
                                   <div class="col-md-4">
                                    <a href="#" class="btn"
                                       data-bs-toggle="modal" data-bs-target="#playerApply"
                                       onclick="updateApplyModalContent('${card.name}','${card.role}','${type}')">申請</a>
                                   </div>
                                  </div>
                                 </div>
                             </div>
                         </div>
                     </div>
                 </div>
                 `);
                });
            }
            else {
                console.log("error");
            }
            updatePagination(response.totalPages, page, response.totalItems, "getCard");
        }
    });
}

// 分頁功能
function updatePagination(totalPages, activePage, totalItems, typeOfCard) {
    $("#paginationInfo").text(`當前第 ${activePage} 頁 ，總共 ${totalItems} 筆資料`);
    const pagination = $("#pagination");
    pagination.empty();

    let prevDisabled = activePage === 1 ? "disabled" : "";
    let nextDisabled = activePage === totalPages ? "disabled" : "";
    console.log(typeOfCard)
    if (typeOfCard == "getCard") {
        pagination.append(`
        <li class="page-item ${prevDisabled}">
            <a class="page-link " href="#" onclick="getSelectionCardNextPage(${activePage - 1}); return false;">          
                <span aria-hidden="true">&laquo;</span>
            </a>
        </li>
        <li class="page-item active" style="z-index:0;">
            <span class="page-link" style="border: 1px solid #fd7e14;">${activePage} / ${totalPages}</span>
        </li>
        <li class="page-item ${nextDisabled}">
            <a class="page-link" href="#" onclick="getSelectionCardNextPage(${activePage + 1}); return false;">
                <span aria-hidden="true">&raquo;</span>
            </a>
        </li>
    `);
    }
    else {
        pagination.append(`
        <li class="page-item ${prevDisabled}">
            <a class="page-link " href="#" onclick="loadCards(${activePage - 1}); return false;">
                <span aria-hidden="true">&laquo;</span>
            </a>
        </li>
        <li class="page-item active" style="z-index:0;">
            <span class="page-link" style="border: 1px solid #fd7e14;">${activePage} / ${totalPages}</span>
        </li>
        <li class="page-item ${nextDisabled}">
            <a class="page-link" href="#" onclick="loadCards(${activePage + 1}); return false;">
                <span aria-hidden="true">&raquo;</span>
            </a>
        </li>
    `);
    }

}

// Apply彈窗資訊獲取
function getApply() {
    $("#ApplyForm").on('submit', function (event) {
        event.preventDefault(); // 防止表單刷新
        let applyName = $("#modal-apply-name").text();
        let applyNote = $("#exampleTextarea").val();
        let applyType = $("#applyModalLabel").text();
        console.log(applyName);
        console.log(applyNote);
        // 動態加入 hidden input
        $(this).append(`<input type="hidden" name="applyName" value="${applyName}">`);
        $(this).append(`<input type="hidden" name="applyNote" value="${applyNote}">`);
        $(this).append(`<input type="hidden" name="applyType" value="${applyType}">`);

        $.ajax({
            url: "/Match/ApplyTask",
            type: "POST",
            data: { applyName: applyName, applyNote: applyNote, applyType: applyType },
            success: function (response) {
                console.log("後端回應:", response);
                $("#playerApply").css("display", "none");
                $("#customConfirm").css("display", "block");
                if (response.message == "資料已存在") {
                    $("#confirmMessage").text("已有申請紀錄！");
                }
                else {
                    $("#confirmMessage").text("申請成功！");
                }
                // 清空 textarea
                $("#exampleTextarea").val("");

                // 關閉 Modal
                $("#playerApply").modal("hide");
            },
            error: function (xhr, status, error) {
                console.error("發生錯誤:", error);
            }
        });
    });
}

// 
function closeConfirm() {
    $("#customConfirm").css("display", "none");
}

// 更新模態視窗內容
function updateInfoModalContent(playerName, playerPosition, imgSrc, userMemo, type) {
    document.getElementById('modal-player-name').innerText = playerName;
    document.getElementById('playerImg').src = imgSrc;
    document.getElementById('userMemo').innerText = userMemo;
    if (type == "user") {
        document.getElementById('modal-player-position').innerText = ("擅長位置：" + playerPosition);
    }
    else {
        document.getElementById('modal-player-position').innerText = ("招募位置：" + playerPosition);
    }
}
function updateApplyModalContent(playerName, playerPosition, type) {
    document.getElementById('modal-apply-name').innerText = playerName;
    if (type == "user") {
        document.getElementById('modal-apply-position').innerText = ("擅長位置：" + playerPosition);
    }
    else {
        document.getElementById('modal-apply-position').innerText = ("招募位置：" + playerPosition);
    }
}