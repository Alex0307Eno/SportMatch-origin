// 切換瀏覽方式
let gridBtn = document.querySelector('.grid_Btn');
let listBtn = document.querySelector('.list_Btn');
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


// 篩選場地-區域
const cityBtn = document.querySelectorAll('.cityList button');
const cityTag_Container = document.querySelector('.cityTag');
const areaCity = {
    "北": [
        "台北市",
        "新北市",
        "基隆市",
        "桃園市",
        "新竹市",
        "新竹縣"
    ],
    "中": [
        "台中市",
        "苗栗縣",
        "彰化縣",
        "南投縣"
    ],
    "南": [
        "台南市",
        "高雄市",
        "雲林縣",
        "嘉義市",
        "嘉義縣",
        "屏東縣"
    ],
    "東": [
        "宜蘭縣",
        "花蓮縣",
        "台東縣"
    ],
    "離島": [
        "澎湖縣",
        "金門縣",
        "連江縣"
    ]
}

let filterData = [];

//區域切換顯示縣市
cityBtn.forEach(function (btn, index) {
    btn.addEventListener("click", function () {
        cityBtn.forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        cityTag_Container.innerHTML = '';

        let area = Object.keys(areaCity)[index];
        if (areaCity[area]) {
            areaCity[area].forEach((city) => {
                const citySpan = document.createElement("span");
                citySpan.innerHTML = `<i class="fa-solid fa-check me-1"></i>${city}`;
                citySpan.classList.add('ct-tag');
                citySpan.addEventListener("click", function () {
                    toggleFilter(this, city);
                })
                cityTag_Container.appendChild(citySpan);
            })
        }

    })
})

// 選縣市
document.querySelector('.cityTag').addEventListener('click', function (e) {
    if (e.target.classList.contains('ct-tag')) {
        e.target.classList.toggle('picked');
    }
});

//選運動類別
document.querySelector('.sport-tag').addEventListener('click', function (e) {
    if (e.target.classList.contains('sport-tag')) {
        e.target.classList.toggle('picked');
    }
});


const selectedFilters = {
    city: [],
    facility: [],
    sportType: []
}

//監聽點篩選點擊
function toggleFilter(element, filterType) {
    const value = element.innerText.trim();

    if (selectedFilters[filterType].includes(value)) {
        selectedFilters[filterType] = selectedFilters[filterType].filter(item => item.value !== value);
        element.classList.remove('picked');
    } else {
        selectedFilters[filterType].push(value);
        element.classList.add('picked');
    }
    updateSearch();
}

// 清除關鍵字搜尋
function clearKeyword() {
    const keyword = document.querySelector('#venueSearch');
    keyword.value = '';
}

//搜尋場地
async function searchVenues() {
    const loading = document.getElementById('loading');
    const query = document.querySelector('#venueSearch').value;
    let apiUrl = `/api/venues/search?query=${query}`;
    loading.classList.remove('d-none');

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            mode: 'cors'
        });

        filterData = await response.json();
        renderVenues(filterData);
    } catch (error) {
        console.error("API錯誤", error);
    } finally {
        setTimeout(function () {
            loading.classList.add('d-none');
        }, 500);
    }
}

//縣市篩選
function filterByCity(city) {
    const filtered = filterData.filter(v => v.city === city);
    renderVenues(filtered);
}

//運動類別篩選
function filterBySportType(sportType) {
    const filtered = filterData.filter(v => v.sportType === sportType);
    renderVenues(filtered);
}

//設備類別篩選
function filterByFacility(facility) {
    const filtered = filterData.filter(v => v.facility === facility);
    renderVenues(filtered);
}

// 渲染場地
function renderVenues(data, query = "") {
    const venueContainer = document.querySelector('.venue-area');
    venueContainer.innerHTML = '';
    if (data.length > 0) {
        let venuesHTML = '';
        data.forEach(venue => {

            venuesHTML += `
                <div class="card" data-type="venue" data-id="${venue.venueId}">
                    <div class="imgOuter card-img-top overflow-hidden"> <img
                    src="https://sportspod.in/cdn/shop/files/dominate-the-tennis-court-with-hiper-interlocking-tiles-604943.jpg?v=1726484993&width=1445"
                    class="card-img-top" alt="...">
                    </div>
                <div class="card-body">
                    <div class="tag-wrap d-flex align-items-center justify-content-between ">
                        <p class="card-text sport-type"><small class="text-secondary">${venue.sportName}</small></p>
                        <button class="btn favBtn" data-type="venue" data-id="${venue.venueId}"><i class="fa-regular fa-heart"></i></button>
                    </div>
                    <h5 class="card-title fw-bold fs-5 mb-3 txt-overflow">${venue.venueName}</h5>
                    <p class="card-text mb-3 fw-bold txt-overflow"><i class="fa-solid fa-location-dot me-2 text-secondary"
                                                                      style="padding: 0 2px;"></i>${venue.city}${venue.address}
                    </p>
                    <p class="card-text fw-bold txt-overflow"><i
                            class="fa-solid fa-hand-holding-dollar me-2 text-secondary"></i>500/小時 1人</p>
            </div>
            </div>`;
            venueContainer.innerHTML = venuesHTML;
        });
    } else {
        venueContainer.classList.add('noData');
        venueContainer.innerHTML = `<div class="noMatchData d-flex flex-column align-items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 24 24" class="mb-4"><g fill="currentColor"><path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12m10-8a8 8 0 1 0 0 16a8 8 0 0 0 0-16" clip-rule="evenodd" fill="rgb(153 159 165)"/><path fill="rgb(153 159 165)" d="M10.29 17.41a1 1 0 0 0 1.268-.627c.287-.848 1.136-1.391 1.813-1.572c.676-.181 1.683-.136 2.356.455a1 1 0 0 0 1.32-1.502c-1.352-1.188-3.138-1.168-4.194-.885s-2.613 1.159-3.19 2.863a1 1 0 0 0 .627 1.268m-1.54-6.16a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3m6.5 0a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3"/></g></svg>
            <p class="text-center fw-bold fs-5 text-secondary">找不到符合條件的場地...</p>
            <p class="text-center fw-normal fs-7 text-secondary mt-2">請試試其他關鍵字</p>
            <button class="btn btn-primary clearKeyWordBtn rounded-pill mt-2" onclick="clearKeyword()" style="background:var(--golden-gradient); color: #1e2125;">清除關鍵字</button>
        </div>`;
    }

    const search_keyWord = document.querySelector('.result-group');
    const keyword = document.getElementById('venueSearch').value;

    if (keyword) {
        search_keyWord.innerHTML = `<div class="search-keyword d-flex align-items-center fs-4"><i class="fa-solid fa-magnifying-glass me-3"></i>符合條件:&nbsp;"<p class="search-text fs-4 fw-bold pe-2 border-end-1 border-light">${keyword}</p>"</div><p class="result-count fs-4  fw-bold  text-secondary">的場地數量：<span class="venuesVal text-dark fw-bold" style="color: var(--orange-400);">${data.length}</span>&nbsp;筆
    </p>`;
    } else {
        search_keyWord.innerHTML = `<p class="result-count fs-4">符合條件的場地數量：<span class="venuesVal fw-bold" style="color: var(--orange-400);">${data.length}</span>&nbsp;筆</p>`;
    }
}

//更新查詢
async function updateSearch() {
    const query = document.getElementById('venueSearch')?.value || "";
    const city = selectedFilters.city.length > 0 ? selectedFilters.city.join(',') : "";
    const sportType = selectedFilters.sportType.length > 0 ? selectedFilters.sportType.join(',') : "";

    let apiUrl = `/api/venues/search?query=${query}`;

    if (city) apiUrl += `&city=${city}`;
    if (sportType) apiUrl += `&sportType=${sportType}`;

    const response = await fetch(apiUrl);
    const data = await response.json();
    console.log("搜尋結果", data);

    renderVenues(data, query);
}

//卡片點擊展開彈窗
document.querySelector('.venue-area').addEventListener('click', async function (e) {
    let venueCard = e.target.closest('.card');
    if (!venueCard) return;

    let venueId = venueCard.getAttribute('data-id');
    if (!venueId) return;

    try {
        let response = await fetch(`/api/venues/${venueId}`);
        if (!response.ok) throw new Error("讀取場地資訊失敗");

        let venueData = await response.json();

        //彈窗內容
        document.querySelector('#dynamicModal .modal-header').classList.add('d-none');
        document.querySelector('#dynamicModal .modal-dialog').classList.add('modal-xl');
        document.querySelector('#dynamicModal .modal-body').classList.add('venueModal_body');
        document.querySelector('#dynamicModal .modal-body').innerHTML = `
        <div class="row justify-content-between">
            <div class="col-5 d-flex flex-column">
                <div class="card bigPic w-100 h-100 mb-2 p-1 position-relative">
                  <button class="btn favBtn position-absolute" data-type="venue" data-id="${venueData.venueId}" style="color:var(--dark-grey);top:10px; left:10px;"><i class="fa-regular fa-heart fs-5"></i></button>
                  <img
                        src="https://sportspod.in/cdn/shop/files/dominate-the-tennis-court-with-hiper-interlocking-tiles-604943.jpg?v=1726484993&width=1445"
                        class="w-100 h-100 mainVenue_image" alt="..." style="object-fit: cover">
                </div>
                <div class="picWrap d-flex align-items-center justify-content-center position-relative">
                    <span class="prevBtn rounded-circle bg-white shadow-sm d-flex align-items-center justify-content-center position-absolute top-50 start-0" role="button" style="width: 30px; height: 30px; transform: translateY(-50%);"><i class="fa-solid fa-chevron-left"></i></span>
                    <img class="thumbnail bg-secondary me-1" alt="..." style="width:50px; height:50px;" src="https://cdn.pixabay.com/photo/2020/11/27/18/59/tennis-5782695_1280.jpg">
                    <img class="thumbnail bg-secondary me-1" alt="..." style="width:50px; height:50px;" src="https://cdn.pixabay.com/photo/2020/04/08/19/04/tennis-5018589_1280.jpg">
                    <img class="thumbnail bg-secondary" alt="..." style="width:50px; height:50px;" src="https://cdn.pixabay.com/photo/2023/04/17/10/31/tennis-7932067_1280.jpg">
                    <span class="nextBtn rounded-circle bg-white shadow-sm d-flex align-items-center justify-content-center position-absolute top-50 end-0" role="button"  style="width: 30px; height: 30px; transform: translateY(-50%);"><i class="fa-solid fa-chevron-right"></i></span>
                </div>
            </div>
            <div class="col-7">
            <button type="button" class="btn-close float-end" data-bs-dismiss="modal" aria-label="Close"></button>
                <p class="fw-bold fs-5 border-start border-4 border-secondary mb-4 fs-4 mt-2 ps-3">${venueData.venueName}<span class="badge border-secondary ms-3">${venueData.sportName}</span></p>
                <p class=" mb-4 "><strong class="fw-bold">地址：</strong> ${venueData.city} ${venueData.address}</p>
                <p class="mb-4 "><strong class="fw-bold">費用：</strong>${venueData.Price}</p>
                <p class="mb-4 "><strong class="fw-bold">開放時間：</strong>venueData.OpenTime</p>
                <p class="mb-4 "><strong class="fw-bold">設備：</strong></p>
                <h4 class="d-flex align-items-center fw-bold fs-5 mb-3 text-secondary">聯絡資訊</h4>
                <p class="mb-4 "><strong class="fw-bold">聯絡電話：</strong></p>
                <p class="mb-4 "><strong class="fw-bold">LINE：</strong></p>
                <p class="mb-4 "><strong class="fw-bold">官網：</strong></p>
            </div>
        </div>
        `;
        document.querySelector('#dynamicModal .modal-footer').style.display = 'none';
        let venueModal = new bootstrap.Modal(document.getElementById('dynamicModal'));
        venueModal.show();

    } catch (error) {
        console.error("載入場地詳情失敗", error);
    }
});

//場地圖片切換
let currentIndex = 0;
let thumbnails = document.querySelectorAll('.thumbnail');
let mainImage = document.querySelector('.mainVenue_image')

// function updateMainImage(imgElement) {
//     thumbnails = document.querySelectorAll('.thumbnail');
//     mainImage.src = thumbnails.src;
//     currentIndex = Array.from(thumbnails).indexOf(imgElement);
// }

document.querySelector("#dynamicModal").addEventListener('click', function (e) {
    thumbnails = document.querySelectorAll('.thumbnail');
    
    if (e.target.classList.contains('prevBtn')) {
        console.log('上一張');
        if (currentIndex > 0) {
            currentIndex --;
            mainImage.src = thumbnails[currentIndex].src;
            currentIndex = Array.from(thumbnails).indexOf(imgElement);
        }
    }
    if (e.target.classList.contains('nextBtn')) {
        console.log('下一張');
        if (currentIndex < thumbnails.length - 1) {
            currentIndex++;
            mainImage.src = thumbnails[currentIndex].src;
            currentIndex = Array.from(thumbnails).indexOf(imgElement);
        }
    }
    if (e.target.classList.contains('thumbnail')) {
        let mainImage = document.querySelector('.mainVenue_image');
        mainImage.src = e.target.src;
    }
});

//TODO判斷哪些是該會員已蒐藏的場地更新愛心狀態

//headerRow sticky調整