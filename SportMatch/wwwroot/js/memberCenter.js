document.addEventListener("DOMContentLoaded", function () {
    fetchAccountInfo();
    fetchUserSport();
    // simpleFooter();
    
    const tabWrap = document.querySelector(".tab-wrapper");
    const tabs = document.querySelectorAll(".nav-item a");
    const contents = document.querySelectorAll(".tab-content");
    
    //分頁面切換
    if(tabWrap) {
        tabs.forEach(tab => {
            tab.addEventListener("click", function (e){
                e.preventDefault();

                tabs.forEach(t => t.classList.remove("active"));
                contents.forEach(c => c.classList.remove("active"));

                this.classList.add("active");
                const targetId = this.getAttribute("aria-controls");
                document.getElementById(targetId).classList.add("active");
            });
        });
    }
});

//取得會員資料
function fetchAccountInfo() {
    fetch('/api/membercenter/account',{
        method: 'GET',
        credentials: 'include'
    })
    .then (response => {
        if (!response.ok) {
            throw new Error('未登入或session過期');
        }
        return response.json();
    })
    .then(data => {
        if (data && data.user) {
            console.log("會員資訊",data.user);
            updateUserUI(data.user);
        } else {
            console.log("未取得會員資訊");
        }
        
    })
    .catch(error => {
        console.error("載入會員資料失敗",error);
    });
}

//取得運動資料
function fetchUserSport() {
    fetch('/api/membercenter/user-sport',{
        method: 'GET',
        credentials: 'include'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('取得運動資料失敗');
        }
        return response.json();
    })
    .then(data => {
        if (data && data.length > 0) {
            console.log("運動資訊",data);
            updateSportUI(data);
        } else {
            console.log("沒運動資料不更新");
        }
    })
    .catch(error => {
        console.error("載入運動資料失敗",error);
    })
}

//更新畫面
function updateUserUI(user) {
    // if (!user) {
    //     console.error("更新UI時user為undefined");
    //     return null;
    // }
    const userEmailContainer = document.querySelector(".user-email-container");
    const userEmail = document.querySelector(".user-email");
    const greeting = document.querySelector(".greeting");

    if (userEmailContainer) userEmailContainer.style.display = "block";
    if (userEmail) userEmail.innerText = user.email;
    if (greeting) greeting.innerHTML = `歡迎，${user.name}<span class="text-secondary">(${user.userName})</span>`;
    
    //綁定會員基本資料
    const avatar = document.querySelector(".avatar");
    const genderTagI = document.querySelector(".genderTag i");
    const userPic = document.querySelector("#userPic_img");
    
    if (userPic) {
        userPic.style.backgroundImage = `url(${user.userPic || ""})`;
    }
    
    if(avatar) {
        if (user.genderId === 1) {
            avatar.classList.add("male");
            genderTagI.classList.add("mars");
        } else if (user.genderId === 2) {
            avatar.classList.add("female");
            genderTagI.classList.add("fa-venus");
        }
    }
    
    //姓名
    const userNameInput = document.querySelector("#userNameInput");
    if(userNameInput) {
        userNameInput.value = user.name || "";
        userNameInput.placeholder = user.name ? "" : "姓名未填寫";
    }
    
    //帳號名
    const userAccountInput = document.querySelector("#userAccountInput");
    if(userAccountInput) {
        userAccountInput.value = user.userName || ""; //待確
        userAccountInput.placeholder = user.userName ? "" : "未填寫帳號名";
    }
    
    //密碼
    const userPwInput = document.querySelector("#userPwInput");
    if (userPwInput) {
        userPwInput.value = user.password; //一定不會空因為註冊一定要填密碼，需要想一下是否有特例
        userPwInput.placeholder = user.password;
    }
    
    //信箱
    const userEmailInput = document.querySelector("#userEmailInput");
    if(userEmailInput) {
        userEmailInput.value = user.email || "";//待確: 有可能是自己輸入帳號註冊（？
        userEmailInput.placeholder = user.email ? "" : "未填寫信箱";
    }
    
    //生日
    const userBirthInput = document.querySelector("#userBirthInput");
    if(userBirthInput) {
        userBirthInput.value = user.birthday ? user.birthday.split("T")[0] : "";
        userBirthInput.placeholder = user.birthday.split("T")[0] || "年/月/日";
    }
    
    //手機
    const userPhoneInput = document.querySelector("#userPhoneInput");
    if(userPhoneInput) {
        userPhoneInput.value = user.mobile || "";
        userPhoneInput.placeholder = user.mobile || "手機號碼未填寫";
    }
    
    //運動資料
    
    //接受招募
    const invitedObj = document.querySelector("#flexSwitchCheckInvited");
    if(invitedObj) {
        invitedObj.checked = user.invited === "Y";
        invitedObj.setAttribute("disabled", "true");
    }
    
    //地區
    const sportArea = document.querySelector("#sportArea");
    if(sportArea) {
        if(user.areaId) {
            sportArea.textContent = user.areaName; 
        } else {
            sportArea.textContent = "尚未選擇區域";
        }
    }
    
    //自介
    const memo = document.querySelector("#user_memo");
    if(memo) {
        if(user.UserMemo && user.UserMemo.trim() !== "") {
            memo.innerText = `${user.UserMemo}`;
        } else {
            memo.textContent = "尚未填寫";
            memo.classList.add("fst-italic");
        }
    }
    
    // return user;
}

function updateSportUI(sports){
    //喜好運動
    const favSport = document.querySelector("#favSport_wrap");
    const sportImage = {
        1: "https://cdn.pixabay.com/photo/2016/11/18/22/10/man-1837119_1280.jpg",
        2: "https://cdn.pixabay.com/photo/2021/07/21/20/11/beach-volleyball-6483905_1280.jpg",
        3: "https://cdn.pixabay.com/photo/2021/02/19/16/36/badminton-6030861_1280.jpg",
    };
    favSport.innerHTML="";
    if(favSport) {
        sports.forEach(sport => {
            const sportCard = document.createElement("div");
            sportCard.classList.add("card", "text-bg-dark", "border-0", "rounded-3", "overflow-hidden");
            const imgSrc = sportImage[sport.sportId];
            sportCard.innerHTML = `
        <img src="${imgSrc}" class="card-img" alt="${sport.sportName}">
            <div class="card-img-overlay">
                <h5 class="card-title text-white">${sport.sportName}</h5>
            </div>`;
            favSport.appendChild(sportCard);
        })
    }
    
    //擅長位置
    const rolePart = document.getElementById("roleContent_wrap");
    if(rolePart) {
        rolePart.innerHTML="";
        sports.forEach(sport => {
            const roleGroup = document.createElement("div");
            roleGroup.classList.add("sportRole_group", "d-flex", "align-items-center", "me-3");
            roleGroup.innerHTML =` 
                <div class="sportRole_group d-flex align-items-center me-3">
                    <p class="sport_name border-start border-secondary border-3 ps-2 me-2 text-nowrap fw-bold">${sport.sportName}</p>
                    <div class="form-select user-select-none" style="background-color: #e9ecef; cursor: default;">${sport.roleName}</div>
                </div> `;
            rolePart.appendChild(roleGroup);
        })
    }
}

// function openModal(title, content, submitUrl = null, submitCallback = null) {
//    
//     if (!modalElement) {
//         return;
//     }
//
//     document.querySelector('#dynamicModal .modal-title').innerHTML = title;
//     document.querySelector('#dynamicModal .modal-body').innerHTML = content;
//     const submitButton = document.getElementById('modalSubmitButton');
//    
//     if(submitButton) {
//         submitButton.replaceWith(submitButton.cloneNode(true));
//         const newSubmitButton = document.getElementById('modalSubmitButton');
//
//         newSubmitButton.addEventListener("click", function () {
//             if (submitCallback) {
//                 submitCallback();
//             } else {
//                 submitForm(submitUrl);
//             }
//         }, { once: true }); 
//     } 
//   
//     const modalInstance = bootstrap.Modal.getOrCreateInstance(modalElement);
//     modalInstance.show();
// }
// function openModal(title, content) {
//     const modalElement = document.getElementById('dynamicModal');
//
//     if (!modalElement) {
//         console.error("請確認 partial view 是否載入");
//         return;
//     }
//
//     modalElement.classList.remove("d-none");
//     modalElement.style.display = "block";
//     modalElement.setAttribute("aria-hidden", "false");
//
//     // 設定標題與內容
//     document.querySelector('#dynamicModal .modal-title').innerHTML = title;
//     document.querySelector('#dynamicModal .modal-body').innerHTML = content;
//
//     new bootstrap.Modal(document.getElementById('dynamicModal')).show();
// }

// document.addEventListener('click', function (e) {
//     if (e.target && e.target.id === 'modalSubmitButton') {
//         const updatedData = {
//             name: document.querySelector("#user-name").value,
//             userName: document.querySelector("#user-nameID").value,
//             genderId: parseInt(document.querySelector("#user-gender").value),
//             birthday: document.querySelector("#user-birthday").value,
//             mobile: document.querySelector("#user-phone").value,
//             password: document.querySelector("#user-password").value
//         };
//         console.log("準備發送 PATCH:", updatedData);
//         fetch('/api/membercenter/update', {
//             method: 'PATCH',
//             headers: {"content-type": "application/json"},
//             body: JSON.stringify(updatedData),
//         })
//             .then(res => res.json())
//             .then ( response => {
//                 if (response.success) {
//                     alert("更新成功");
//                     fetchAccountInfo();
//                     closeModal();
//                 } else  {
//                     alert("更新失敗");
//                 }
//             })
//             .catch(error => console.error("更新錯誤",error));
//     }
// });

// function simpleFooter(){
//     const ft = document.querySelector("footer");
//     ft.classList.add("simple");
// }

//更新基本資料
function updateUserInfo() {
    const updatedData = {
        name: document.querySelector("#user-name").value,
        userName: document.querySelector("#user-nameID").value,
        genderId: parseInt(document.querySelector("#user-gender").value),
        birthday: document.querySelector("#user-birthday").value.toString(),
        password: document.querySelector("#user-password").value,
        mobile: document.querySelector("#user-phone").value
    };

    console.log(updatedData);

    const passwordField = document.querySelector("#user-password");
    if (passwordField.value.trim() !== "") {
        updatedData.password = passwordField.value;
    }
    fetch('/api/membercenter/update/userData', {
        method: 'PATCH',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(updatedData),
    })
        .then(res => res.json())
        .then(response => {
            if (response.success) {
                alert("更新成功");
                
                // updateUserInfo();
                // const modalElement = document.querySelector("#userDataModal");
                // modalElement.classList.remove("show");
            } else {
                alert("更新失敗")
            }
        })
        .catch(error => {console.error(error)});
}

function updateUserSport() {
    const updatedData = {
        user: {
            userMemo: document.querySelector("#userMemoTextarea").value,
            areaId: parseInt(document.querySelector("#user-area-select").value),
            invited: document.querySelector("#switchCheckInvited").checked ? "Y" : "N",
        },
        sport: Array.from(document.querySelectorAll(".form-check-input-sportType:checked")).map((checkbox) => {
            return {
                sportId: parseInt(checkbox.value),
                roleId: parseInt(document.querySelector(`[data-sportid="${checkbox.value}"]`).value)
            }
        }),
    };
    
    fetch('/api/membercenter/updateUserSport', {
        method: 'PATCH',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(updatedData),
    })
    .then(res => res.json())
    .then(response => {
        if (response.success) {
            alert("更新成功");
        } else {
            alert("更新失敗");
        }
    })
        .catch(error => {console.error(error)});
}