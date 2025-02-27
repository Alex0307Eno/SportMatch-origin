// 更新模態視窗內容
function updateInfoModalContent(playerName, playerPosition, imgSrc) {
    document.getElementById('modal-player-name').innerText = playerName;
    document.getElementById('modal-player-position').innerText = ("擅長位置："+ playerPosition);
    document.getElementById('playerImg').src = imgSrc;
}
function updateApplyModalContent(playerName, playerPosition) {
    document.getElementById('modal-apply-name').innerText = playerName;
    document.getElementById('modal-apply-position').innerText = ("擅長位置：" + playerPosition);
}
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
function toggleAccordion(sportId) {
    let target = document.getElementById(sportId);
    let bsCollapse = new bootstrap.Collapse(target);
    bsCollapse.toggle();
}