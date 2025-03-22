//基本資料編輯-彈窗渲染
document.querySelector("#editProfileBtn").addEventListener("click", function (e) {
    fetch('/api/membercenter/account')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (!data || !data.user) {
                alert("無法獲取會員資料，請稍候再試");
                return;
            }
            const userData = data.user;
            const targetContent = document.querySelector("#userDataModal .modal-body");
            targetContent.innerHTML = `
                <div class="mb-3">
                    <label for="user-name" class="col-form-label">姓名</label>
                    <input type="text" class="form-control" id="user-name" value="${userData.name || ''}">
                </div>
                <div class="mb-3">
                    <label for="user-nameID" class="col-form-label">帳號名稱</label>
                    <input type="text" class="form-control" id="user-nameID" value="${userData.userName || ''}">
                </div>
                <div class="mb-3">
                    <label for="user-gender" class="col-form-label">性別</label>
                    <select class="form-select" id="user-gender">
                        <option value="1" ${(userData.genderId === 1) ? 'selected="selected"' : ""}>男</option>
                        <option value="2" ${(userData.genderId === 2) ? 'selected="selected"' : ""}>女</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label for="user-birthday" class="col-form-label">生日</label>
                    <input type="date" class="form-control" id="user-birthday" value="${userData.birthday.split('T')[0] || ''}">
                </div>
                <div class="mb-3">
                    <label for="user-email" class="col-form-label">信箱</label>
                    <input type="email" class="form-control" id="user-email" value="${userData.email}">
                </div>
                <div class="mb-3">
                    <label for="user-password" class="col-form-label">密碼</label>
                    <input type="password" class="form-control" id="user-password" value="${userData.password}">
                </div>
                <label for="user-phone" class="col-form-label">手機</label>
                <div class="input-group mb-3 p-0">
                    <input type="text" class="form-control" id="user-phone" value="${userData.mobile || ''}">
                    <button class="btn btn-outline-secondary" type="button">傳送驗證碼</button>
                </div>
        `;
            
        })
        .catch(error => console.error("載入會員資料失敗", error));
});

//運動資料編輯-彈窗渲染
document.querySelector("#editPreferBtn").addEventListener("click", function (e) {
    Promise.all([
        fetch('/api/membercenter/user-sport').then(response => response.json()),
        fetch('/api/membercenter/account').then(response => response.json()),
        fetch('/api/sport-roles').then(response => response.json()),
    ])
    .then (([userSport, userdata, sport_AllRole]) => {
        console.log("運動資料",userSport);
        console.log("基本資料",userdata);
        
        const sportOptions = {
            1: "籃球",
            2: "排球",
            3: "羽球"
        };
        
        let sportRole = "";
        userSport.forEach((sport) => {
            let roleOptions = sport_AllRole
                .find ( s=> s.sportId === sport.sportId)?.role
                .map( (role) => 
                    `<option value="${role.roleId}" ${userSport.some(s => s.roleId === role.roleId) ? "selected" : ""}>
                    ${role.roleName}
                    </option>`
                ).join("") || "";
            
            sportRole += `
                    <label class="col-form-label sport_name border-start border-secondary border-3 ps-2 me-2 text-nowrap fw-bold">
                    ${sportOptions[sport.sportId]}
                    </label>
                    <select class="from-select me-3" aria-label="user-role" style="width: 100px; height: 36px;">
                        ${roleOptions}
                    </select>
            `;
        });
        const targetContent = document.querySelector("#userSportModal .modal-body");
            targetContent.innerHTML = `
                    <h4 class="blockTitle d-flex align-items-center justify-content-start mb-3"><span><i class="fa-solid fa-heart me-1"></i>喜好運動</span><span class="hint ms-3">將推薦所選運動類別的相關賽事和隊伍</span></h4>
                    <div class="form-check form-check-inline">
                      <input class="form-check-input form-check-input-sportType" type="checkbox" id="inlineCheckbox1" value="1" ${userSport.some(s => s.sportId === 1) ? "checked= 'checked'" : ""}>
                      <label class="form-check-label" for="inlineCheckbox1">籃球</label>
                    </div>
                    <div class="form-check form-check-inline">
                      <input class="form-check-input form-check-input-sportType" type="checkbox" id="inlineCheckbox2" value="2" ${userSport.some(s => s.sportId === 2) ? "checked= 'checked'" : ""}>
                      <label class="form-check-label" for="inlineCheckbox2">排球</label>
                    </div>
                    <div class="form-check form-check-inline">
                      <input class="form-check-input form-check-input-sportType" type="checkbox" id="inlineCheckbox3" value="3" ${userSport.some(s => s.sportId === 3) ? "checked= 'checked'" : ""}>
                      <label class="form-check-label" for="inlineCheckbox3">羽球</label>
                    </div>
                    <h4 class="blockTitle d-flex align-items-center justify-content-start mb-3"><span><i class="fa-solid fa-thumbs-up me-1"></i>擅長位置</span><span class="hint ms-3">擅長的運動位置，預設會推薦相關有招募此位置的隊伍</span></h4>
                    <div class="roleWrap content-group d-flex align-items-center mb-3">${sportRole}</div>
                    <div class="mb-3">
                        <label for="userMemoTextarea" class="col-form-label blockTitle d-flex align-items-center justify-content-start mb-3"><span><i class="fa-solid fa-child me-1"></i>個人介紹</span><span class="hint ms-3">讓大家更了解你擅長的運動及位置</span></label>
                        <textarea class="form-control" id="userMemoTextarea" rows="3">${userdata.memo || ""}</textarea>
                    </div>
                    <div class="input-group d-flex flex-column mb-3 p-0">
                        <label for="user-phone" class="col-form-label blockTitle d-flex align-items-center justify-content-start mb-3"><span><i class="fa-solid fa-location-dot me-1"></i>所在地</span><span class="hint ms-3">將會推薦您此區域的賽事及隊伍</span></label>
                        <select class="form-select" id="user-area-select" aria-label="user-sportArea" style="width:200px;">
                          <option ${userdata.areaId === null ? "selected" : ""}>請選擇所在區域</option>
                          <option value="1" ${userdata.user.areaId === 1 ? "selected" : ""}>北</option>
                          <option value="2" ${userdata.user.areaId === 2 ? "selected" : ""}>中</option>
                          <option value="3" ${userdata.user.areaId === 3 ? "selected" : ""}>南</option>
                          <option value="4" ${userdata.user.areaId === 4 ? "selected" : ""}>東</option>
                        </select>
                    </div>
                    <div class="w-100 d-flex flex-column">
                    <h4 class="blockTitle d-flex align-items-center justify-content-start mb-3"><span><i class="fa-solid fa-users me-1"></i>接受招募</span><span class="hint ms-3">啟用後，系統將推薦你給需要隊員的隊伍</span></h4>
                    <div class="form-check d-flex align-items-center form-switch">
                        <input class="form-check-input me-2" type="checkbox" id="switchCheckInvited" ${userdata.user.invited === "Y" ? "checked" : ""}>
                        <label class="form-check-label mt-1" for="switchCheckInvited">啟用</label>
                    </div>
                </div>
            `;
        })
        .catch(error => { console.error("載入運動資料失敗",error); });
});



