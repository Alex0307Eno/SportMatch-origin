history.pushState({}, '', 'Door');

var TopMask = document.querySelector(".TopMask");
var BottomMask = document.querySelector(".BottomMask");
var DoorBackground = document.querySelector(".DoorBackground");

var Logos = [
    document.querySelector(".BadmintonLogo"),
    document.querySelector(".BasketballLogo"),
    document.querySelector(".VolleyballLogo")
];

var LogosBG = [
    document.querySelector(".BadmintonLogoBackground"),
    document.querySelector(".BasketballLogoBackground"),
    document.querySelector(".VolleyballLogoBackground")
];

var ChooseText = document.getElementById("ChooseText");

window.onload = function () {
    // 1: 圖片1下拉
    setTimeout(function () {
        BottomMask.style.transform = "translate(0, 30vh)";
    }, 100);


    // 2: 圖片1上拉同時圖片2下拉
    setTimeout(function () {
        TopMask.style.transform = "translate(0, -150vh)";
        BottomMask.style.transform = "translate(0, 250vh)";
        TopMask.style.transition = "transform 0.5s ease-in-out";
        BottomMask.style.transition = "transform 0.5s ease-in-out";
    }, 2000);

    // 3: 圖片1、2隱藏 圖片3模糊
    setTimeout(function () {
        TopMask.style.display =
            BottomMask.style.display =
            "none";
        DoorBackground.style.filter = "blur(10px)";
    }, 2500);

    // 4: 圖片4、5、6顯示
    for (let i = 0; i < Logos.length; i++) {
        setTimeout(function () {
            Logos[i].style.clipPath = "polygon(100% 0%, 50% 0%, 0% 100%, 50% 100%)";
        }, 4000 + (i * 300));
        setTimeout(function () {
            LogosBG[i].style.clipPath = "polygon(100% 0%, 50% 0%, 0% 100%, 50% 100%)";
        }, 4000 + (i * 300));
    }

    // 5: 顯示文字
    setTimeout(function () {
        ChooseText.style.visibility = "visible";
    }, 5500);

    Logos.forEach(function (item) {
        item.addEventListener("click", function () {
            const ballSpecies = this.closest('a').getAttribute('data-ballSpecies');
            console.log(ballSpecies)
            localStorage.setItem('ballSpecies', ballSpecies);

            this.style.pointerEvents = "none";
            this.style.clipPath = "none"
            this.style.transform = "clip-path 0s";
            this.src = `/image/DoorImage/${this.id}03.png`;
            this.style.transform = "translate(-50%, -50%) scale(1.1)";
            this.style.filter = "blur(150px)";
            this.style.opacity = "0";
        });
    });
};

// 延遲跳轉時間
function HomeLinkDelay(url) {
    setTimeout(function () {
        window.location.href = url;
    }, 100);
}


