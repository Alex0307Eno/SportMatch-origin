// 切換瀏覽方式
let gridBtn  = document.querySelector('.grid_Btn');
let listBtn  = document.querySelector('.list_Btn');
let venueWrap = document.querySelector('.venue-area');

gridBtn.addEventListener("click", function () {
    gridBtn.classList.add('active');
    listBtn.classList.remove('active');
    venueWrap.classList.remove('list');
    venueWrap.classList.add('grid');
});

listBtn.addEventListener("click", function () {
    listBtn.classList.add('active');
    gridBtn.classList.remove('active');
    venueWrap.classList.remove('grid');
    venueWrap.classList.add('list');
});