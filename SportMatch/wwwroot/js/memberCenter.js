
window.onload = function () {
    fetchAccountInfo();
}

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
        console.log("會員資訊",data);
        updateUserUI(data.user);
    })
    .catch(error => {
        console.error("載入會員資料失敗",error);
    });
}

function updateUserUI(user) {
    const userEmailContainer = document.querySelector(".user-email-container");
    const userEmail = document.querySelector(".user-email");
    const greeting = document.querySelector(".greeting");

    if (userEmailContainer) userEmailContainer.style.display = "block";
    if (userEmail) userEmail.innerText = user.email;
    
    greeting.innerHTML = `歡迎，${user.name}<span class="text-secondary">(${user.userName})</span>`;
}


function openModal(title, content, submitUrl = null) {
    document.querySelector('#dynamicModal .modal-title').innerHTML = title;
    document.querySelector('#dynamicModal .modal-body').innerHTML = content;
    
   if(submitUrl) {
       document.querySelector('#dynamicModal .modal-title').style.display = 'flex';
       document.getElementById('modalSubmitButton').onclick = function () {
           submitForm(submitUrl);
       };
   } else {
       document.getElementById('modalSubmitButton').style.display = 'none';
   }
   
   new bootstrap.Modal(document.getElementById('dynamicModal')).show();
}