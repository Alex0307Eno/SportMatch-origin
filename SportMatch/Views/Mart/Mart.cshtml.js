
// 選取另一個父分類時取消選擇底下子分類
$("input[name='ParentCategory']").change(function () {
    $(".ChildCategoryCheckbox").prop("checked", false);
});

////modal的footer圖片
//var FooterImages = [
//    document.getElementById("ModelFooterProductImage01"),
//    document.getElementById("ModelFooterProductImage02"),
//    document.getElementById("ModelFooterProductImage03")
//];

//var BodyImage = document.getElementById("ModelBodyProductImage");

//FooterImages.forEach(function (item) {
//    item.addEventListener('click', function () {
//        BodyImage.src = `/image/${item.id}.jpg`;
//    });
//});

// 加入我的最愛
function HeartIconChange(button) {
    console.log(button);

    var ItemID = button.getAttribute('data-ProductID');
    var ItemMyHeart = button.getAttribute('data-MyHeart');

    var Icon = document.getElementById('ModalHeartIcon_' + ItemID);
    var Modal = new bootstrap.Modal(document.getElementById('HeartModal'));
    var ModalMessage = document.getElementById('HeartModalMessage');

    if (ItemMyHeart == 'true') {

        Icon.classList.remove('bi-heart-fill');
        Icon.classList.add('bi-heart');
        button.setAttribute('data-MyHeart', 'false');
        console.log(button);
        Icon.style.color = "#FFFFFF";
        ModalMessage.innerHTML = "已從我的最愛移除";
    } else {
        Icon.classList.remove('bi-heart');
        Icon.classList.add('bi-heart-fill');
        button.setAttribute('data-MyHeart', 'true');
        console.log(button);
        Icon.style.color = "#FF007F";
        ModalMessage.innerHTML = "已加入我的最愛";
    }

    Modal.show();
    setTimeout(function () {
        Modal.hide();
    }, 1000);
}

//加入購物車
function GetCartModalSuccess(CartExist) {
    var GetCartModal = new bootstrap.Modal(document.getElementById('GetCartModal'));
    var GetCartModalMessage = document.getElementById('GetCartModalMessage');
    if (CartExist) {
        GetCartModalMessage.innerHTML = "商品成功加入購物車";
    }
    else {
        GetCartModalMessage.innerHTML = "購物車已經有該商品";
    }

    GetCartModal.show();
    setTimeout(function () {
        GetCartModal.hide();
    }, 1000);
}

// 購物車localstorage傳送資料用
function AddToCart(button) {
    console.log(button)
    // 從按鈕的 data-* 屬性中獲取商品資料
    ItemID = button.getAttribute('data-ProductID');
    ItemName = button.getAttribute('data-Name');
    ItemPrice = button.getAttribute('data-Price');
    ItemDiscount = button.getAttribute('data-Discount');
    ItemImage = button.getAttribute('data-Image');
    ItemStock = button.getAttribute('data-Stock');

    // 檢查 localStorage 是否已有購物車
    let Cart = JSON.parse(localStorage.getItem("Cart")) || [];

    // 檢查是否已經有此商品，若有則更新數量，若沒有則新增
    let existingItem = Cart.find(Item => Item.ID === ItemID);
    if (existingItem) {
        GetCartModalSuccess(false);
    } else {
        Cart.push({
            ID: ItemID,
            Name: ItemName,
            Price: ItemPrice,
            Discount: ItemDiscount,
            Image: ItemImage,
            Stock: ItemStock,
            Quantity: 1
        });
        GetCartModalSuccess(true);

    }

    // 將更新後的購物車儲存在 localStorage
    localStorage.setItem("Cart", JSON.stringify(Cart));

    //// 這會顯示儲存的字串資料
    //let cartData = localStorage.getItem("Cart");
    //console.log(cartData);
    //let parsedCart = JSON.parse(cartData);  // 將字串解析回物件
    //console.log(parsedCart);
}


let currentPage = 1;  // 默認頁碼
let itemsPerPage = 8; // 每頁顯示商品數量

// 當頁面加載完成後，開始抓取商品資料
document.addEventListener('DOMContentLoaded', function () {
    fetchProducts(currentPage, itemsPerPage);
});


function fetchProducts(page = 1, itemsPerPage = 8) {
    fetch(`/api/products?page=${page}&itemsPerPage=${itemsPerPage}`)
        .then(response => response.json())
        .then(data => {
            renderProducts(data.products);  // 根據返回的資料渲染商品
            updatePagination(data.totalPages, data.currentPage);  // 更新分頁按鈕
        })
        .catch(error => console.error('Error fetching products:', error));
}

function renderProducts(products) {
    const productContainer = document.querySelector('.ProductsList');
    productContainer.innerHTML = '';

    products.forEach(item => {
        const productCard = `
            <!-- 商品1 -->
                    <div class="col-12 col-md-5 col-lg-3 mb-3" >
                        <div class="card bg-dark ProductsCard" style="border: 1px solid #ff5f00;cursor: pointer;">
                            <img src="${item.image}" class="card-img-top" alt="${item.name}" data-bs-toggle="modal" data-bs-target="#ProductModal_${item.productID}">
                            <div class="w-80 card-body">
                                <h5 class="card-title text-white" data-bs-toggle="modal" data-bs-target="#ProductModal_${item.productID}">${item.name}</h5>
                                <div class="CardButton d-flex">
                                    <div class="d-flex">
                                        ${item.discount < 0 ? `
                                        <div data-bs-toggle="modal" data-bs-target="#ProductModal_${item.productID}">
                                            <button class="btn btn-dark" style="background-color: #ff0000;pointer-events: none;">${item.discount} %</button>
                                        </div>` : ''}
                                        <div data-bs-toggle="modal" data-bs-target="#ProductModal_${item.productID}" >
                                            <button class="btn btn-dark" style="background-color: #ff5f00;pointer-events: none;" data-bs-target="#ProductModal_${item.productID}">${item.price}</button>
                                        </div>
                                    </div>
                                    <button class="btn btn-dark ms-auto" style="font-size: 13px;background-color: #ff5f00;"
                                            data-ProductID="${item.productID}"
                                            data-Name="${item.name}"
                                            data-Price="${item.price}"
                                            data-Discount="${item.discount}"
                                            data-Image="${item.image}"
                                            data-Stock=" ${item.stock}"
                                            onclick="AddToCart(this)"
                                            ${item.stock <= 0 ? 'disabled' : ''}
                                            onmousemove="this.style.color='black';"
                                            onmouseout="this.style.color='white';">
                                        <i class="bi bi-cart4" ></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

            <!-- 彈出視窗 -->
                    <div class="modal fade" id="ProductModal_${item.productID}" tabindex="-1">
                        <div class="modal-dialog modal-xl">
                            <div class="modal-content" style="background-color:#000000">
                                <!-- Header -->
                                <div class="modal-header d-flex">
                                    <h5 class="modal-title" id="ProductModalLabel_${item.productID}">商品詳情</h5>
                                    <button type="button" class="btn-close ml-auto" style="background-color:#ff5f00;" data-bs-dismiss="modal"></button>
                                </div>

                                <!-- Body -->
                                <div class="modal-body d-flex">
                                    <!-- 左側商品圖片 -->
                                    <div class="d-flex align-items-center" style="max-width: 40%;height: auto;">
                                        <img src="${item.image}" alt="商品圖片" class="img-fluid" style="max-width:100%;height: auto;" id="ModelBodyProductImage_${item.productID}" />
                                    </div>

                                    <!-- 右側資訊欄 -->
                                    <div class="w-100"  style="padding: 20px;">
                                        <div class="d-flex">
                                            <h3 class="mb-3 d-flex">${item.name}</h3>

                                            <!-- 我的最愛 -->
                                            <button class="btn mb-4 ms-auto fs-5" data-ProductID="${item.productID}" onclick="HeartIconChange(this)">
                                                <i class="bi bi-heart" style="color:#ffffff" id="ModalHeartIcon_${item.productID}"></i>
                                            </button>                   

                                        </div>
                                        <p>商品價格:<strong>${item.price}</strong></p>
                                        <p>
                                            <strong>商品是否有貨:</strong>
                                            <button class="btn text-white" style="background-color: #ff5f00;pointer-events: none;" ${item.stock > 0 ? '' : 'disabled'}> ${item.stock > 0 ? '有貨' : '缺貨'}</button >
                                        </p>
                                        <p><strong>商品詳細資訊:</strong> 這裡顯示詳細資訊</p>
                                    </div>
                                </div>

                                <!-- Footer -->
                                <div class="modal-footer d-flex">
                                    <!-- 左側: 三張圖片 -->
                                    <div class="ModalFooterImages d-flex">

                                    </div>   
                                    <!-- 右側: 加入購物車按鈕 -->
                                    <button class="btn ms-auto text-white" style="background-color: #ff5f00"
                                            data-ProductID="${item.productID}"
                                            data-Name="${item.name}"
                                            data-Price="${item.price}"
                                            data-Discount="${item.discount}"
                                            data-Image="${item.image}"
                                            data-Stock=" ${item.stock}"
                                            onclick="AddToCart(this)"
                                            ${item.stock <= 0 ? 'disabled' : ''}>
                                        加入購物車
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
        `;
        productContainer.innerHTML += productCard;

    });
}

function updatePagination(totalPages, currentPage) {
    const paginationContainer = document.querySelector('.pagination');
    paginationContainer.innerHTML = '';

    // 添加上一頁按鈕
    paginationContainer.innerHTML += `<li class="page-item"><a class="page-link" style="background-color: #000000;color:#ffffff;border: 1px solid #ff5f00;cursor: pointer;" onclick="fetchProducts(${currentPage - 1})">&laquo;</a></li>`;

    // 顯示頁碼
    for (let i = 1; i <= totalPages; i++) {
        paginationContainer.innerHTML += `
            <li class="page-item" style="background-color: #000000; color: #ffffff;cursor: pointer;">
                <a class="page-link"
                   onclick="fetchProducts(${i})" 
                   style="${i === currentPage ? 'background-color: #ff5f00; color: #000000; border: 1px solid #ff5f00;' : 'background-color: #000000; color: #ffffff;border: 1px solid #ff5f00;'}">
                   ${i}
                </a>
            </li>
        `;
    }

    // 添加下一頁按鈕
    paginationContainer.innerHTML += `<li class="page-item"><a class="page-link" style="background-color: #000000;color:#ffffff;border: 1px solid #ff5f00;cursor: pointer;" onclick="fetchProducts(${currentPage + 1})">&raquo;</a></li>`;
}

