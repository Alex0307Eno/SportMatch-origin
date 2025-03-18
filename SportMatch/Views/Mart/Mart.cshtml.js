// 加入我的最愛
function HeartIconChange(button) {
    let ItemID = button.getAttribute('data-ProductID');
    let ItemMyHeart = button.getAttribute('data-MyHeart');

    let Icon = document.getElementById('ModalHeartIcon_' + ItemID);
    let Modal = new bootstrap.Modal(document.getElementById('HeartModal'));
    let ModalMessage = document.getElementById('HeartModalMessage');

    if (ItemMyHeart == 'true') {

        Icon.classList.remove('bi-heart-fill');
        Icon.classList.add('bi-heart');
        button.setAttribute('data-MyHeart', 'false');
        Icon.style.color = "#FFFFFF";
        ModalMessage.innerHTML = "已從我的最愛移除";
    } else {
        Icon.classList.remove('bi-heart');
        Icon.classList.add('bi-heart-fill');
        button.setAttribute('data-MyHeart', 'true');
        Icon.style.color = "#FF007F";
        ModalMessage.innerHTML = "已加入我的最愛";
    }

    Modal.show();
    setTimeout(function () {
        Modal.hide();
    }, 450);
}

//加入購物車
function GetCartModalSuccess(CartExist) {
    let GetCartModal = new bootstrap.Modal(document.getElementById('GetCartModal'));
    let GetCartModalMessage = document.getElementById('GetCartModalMessage');
    if (CartExist) {
        GetCartModalMessage.innerHTML = "商品成功加入購物車";
    }
    else {
        GetCartModalMessage.innerHTML = "購物車已經有該商品";
    }

    GetCartModal.show();
    setTimeout(function () {
        GetCartModal.hide();
    }, 450);
}

// 購物車localstorage傳送資料用
function AddToCart(button) {
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
            Image01: ItemImage,
            Stock: ItemStock,
            Quantity: 1
        });
        GetCartModalSuccess(true);

    }
    // 將更新後的購物車儲存在 localStorage
    localStorage.setItem("Cart", JSON.stringify(Cart));
}

let currentPage;
let itemsPerPage;
let orderByDesc;

let priceSort = document.getElementById('PriceSort');


// 分頁
function fetchProducts(page = 1, itemsPerPage = 10, orderByDesc = priceSort.value, categoryName = "全部", subCategoryName = ['無']) {
    let subCategoryNamesStr = subCategoryName.join(',') || '';
    console.log(page, itemsPerPage, orderByDesc, categoryName, subCategoryName)
    //console.log(subCategoryNamesStr)
    // 字串部分需為C#端參數名稱
    fetch(`/api/products?page=${page}&itemsPerPage=${itemsPerPage}&orderByDesc=${orderByDesc}&_categoryName=${categoryName}&_subCategoryName=${subCategoryNamesStr}`)
        .then(response => response.json())
        .then(data => {
            renderProducts(data.products);  // 渲染商品
            updatePagination(data.totalPages, data.currentPage);  // 更新分頁按鈕
        })
}


let subLabelText = ['無'];
let parentLabelText = "全部";
// 選取父分類
$("input[name='ParentCategory']").change(function () {
    // 取消選擇其他子分類
    $(".ChildCategoryCheckbox").prop("checked", false);
    subLabelText = ['無'];
    let selectedRadio = $(this);
    parentLabelText = $("label[for='" + selectedRadio.attr("id") + "']").text();
    fetchProductsNowPageCheck(undefined, undefined, undefined, parentLabelText, subLabelText);

});

//選取子分類
$("input[name='SubCategory']").change(function () {
    let selectedRadio = $(this);
    let subCategoryLabel = $("label[for='" + selectedRadio.attr("id") + "']").text();
    if (selectedRadio.prop("checked")) {
        subLabelText = subLabelText.filter(item => item !== "無");
        subLabelText.push(subCategoryLabel);
    } else {
        subLabelText = subLabelText.filter(item => item !== subCategoryLabel);
        if (subLabelText.length === 0) {
            subLabelText.push("無");
        }
    }
    fetchProductsNowPageCheck(undefined, undefined, undefined, parentLabelText, subLabelText);
});

// 維持當下頁數
function fetchProductsNowPageCheck(_Page, _itemsPerPage, _orderByDesc, _categoryName, _subCategoryName) {
    let nextPageButtons = document.querySelectorAll('.nextPageButton');
    nextPageButtons.forEach(button => {
        if (button.querySelector('.numberPageButtonLinkTake')) {
            let nowPage = button.querySelector('.numberPageButtonLinkTake').innerText;
            fetchProducts(nowPage, _itemsPerPage, _orderByDesc, _categoryName, _subCategoryName);
        }
    });
}

// 載入完成抓取商品資料
document.addEventListener('DOMContentLoaded', function () {
    fetchProducts();
});

// 價格大小排序   
priceSort.addEventListener('change', function () {
    fetchProductsNowPageCheck(undefined, undefined, undefined, parentLabelText, subLabelText);
});


let windowWidth;
// 視窗大小事件
window.addEventListener('resize', function () {   
    if (window.innerWidth < 1200) {
        windowWidth = 4
    }
    else if (window.innerWidth < 1350) {
        windowWidth = 6
    }
    else if (window.innerWidth < 1700) {
        windowWidth = 8
    }
    else {
        windowWidth = 10;
    }
    fetchProductsNowPageCheck(undefined, windowWidth, undefined, parentLabelText, subLabelText);
});

// 捕捉CSS隔離標籤
function addCssIsolationElement() {
    function cssIsolationElement() {
        for (let sheet of document.styleSheets) {
            for (let rule of sheet.cssRules) {
                const match = rule.selectorText?.match(/\.MartContainer\[(b-[^\]]+)\]/);
                if (match) { return match[1]; }
            }
        }
    }
    //console.log(cssIsolationElement())
    document.querySelectorAll('*').forEach(div => {
        div.setAttribute(cssIsolationElement(), '');
    });
}

//以下HTML
function renderProducts(products) {
    const productContainer = document.querySelector('.ProductsList');
    productContainer.innerHTML = ''; // 清空容器

    products.forEach(item => {
        // 產品卡片的外層div
        const colDiv = document.createElement('div');
        colDiv.className = 'col-3 mt-4';
        colDiv.classList.add('ProductsCardDiv');

        // 產品卡片
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('ProductsCard');

        // 產品圖片
        const cardImgBody = document.createElement('div');
        cardImgBody.classList.add('ProductsCardImgBody');

        const img = document.createElement('img');
        img.src = item.image01;
        img.className = 'card-img-bottom';
        img.classList.add('ProductsCardImg');
        img.setAttribute('data-bs-toggle', 'modal');
        img.setAttribute('data-bs-target', `#ProductModal_${item.productID}`);

        // 下方產品資訊
        const cardBody = document.createElement('div');
        cardBody.className = 'w-80 card-body';

        // 產品標題
        const title = document.createElement('h5');
        title.setAttribute('data-bs-toggle', 'modal');
        title.setAttribute('data-bs-target', `#ProductModal_${item.productID}`);
        title.textContent = item.name;

        // 按鈕區塊
        const buttonDiv = document.createElement('div');
        buttonDiv.className = 'CardButton d-flex';

        // 折扣按鈕
        if (parseInt(item.discount) > 0) {
            const discountDiv = document.createElement('div');
            discountDiv.setAttribute('data-bs-toggle', 'modal');
            discountDiv.setAttribute('data-bs-target', `#ProductModal_${item.productID}`);

            const discountText = document.createElement('div');
            discountText.classList.add('DiscountText');
            discountText.textContent = `-${item.discount} %`;

            discountDiv.appendChild(discountText);
            buttonDiv.appendChild(discountDiv);
        }

        // 價格按鈕
        const priceDiv = document.createElement('div');
        priceDiv.setAttribute('data-bs-toggle', 'modal');
        priceDiv.setAttribute('data-bs-target', `#ProductModal_${item.productID}`);

        const priceText = document.createElement('div');
        priceText.classList.add('PriceText');
        priceText.textContent = item.price;

        priceDiv.appendChild(priceText);
        buttonDiv.appendChild(priceDiv);

        // 加入購物車按鈕
        const cartButton = document.createElement('button');
        cartButton.className = 'btn ms-auto';
        cartButton.style.fontSize = '13px';
        cartButton.classList.add('CartButton');
        cartButton.setAttribute('data-ProductID', item.productID);
        cartButton.setAttribute('data-Name', item.name);
        cartButton.setAttribute('data-Price', item.price);
        cartButton.setAttribute('data-Discount', item.discount);
        cartButton.setAttribute('data-Image', item.image01);
        cartButton.setAttribute('data-Stock', item.stock);
        cartButton.onclick = function () { AddToCart(this); };
        cartButton.disabled = item.stock <= 0;


        const cartIcon = document.createElement('i');
        cartIcon.className = 'bi bi-cart4';

        cartButton.appendChild(cartIcon);
        buttonDiv.appendChild(cartButton);

        cardImgBody.appendChild(img);

        // 將內容組裝進卡片
        cardBody.appendChild(title);
        cardBody.appendChild(buttonDiv);
        cardDiv.appendChild(cardImgBody);
        cardDiv.appendChild(cardBody);
        colDiv.appendChild(cardDiv);
        productContainer.appendChild(colDiv);


        /*----以下modal----*/


        // 創建模態框
        const modalDiv = document.createElement('div');
        modalDiv.className = 'modal fade';        
        modalDiv.id = `ProductModal_${item.productID}`;
        modalDiv.tabIndex = '-1';

        const modalDialog = document.createElement('div');
        modalDialog.className = 'modal-dialog modal-xl';

        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        modalContent.classList.add('ModalContent');        

        // Modal Header
        const modalHeader = document.createElement('div');
        modalHeader.className = 'modal-header d-flex';

        const modalTitle = document.createElement('h5');
        modalTitle.className = 'modal-title';
        modalTitle.id = `ProductModalLabel_${item.productID}`;
        modalTitle.textContent = `${item.categoryName}${item.subCategoryName}`;

        // 關閉按鈕
        const closeButton = document.createElement('button');
        closeButton.className = 'btn-close ml-auto';
        closeButton.classList.add('CloseButton');
        closeButton.setAttribute('data-bs-dismiss', 'modal');

        modalHeader.appendChild(modalTitle);
        modalHeader.appendChild(closeButton);

        // Modal Body
        const modalBody = document.createElement('div');
        modalBody.className = 'modal-body d-flex';

        // 左側圖片
        const leftDiv = document.createElement('div');
        leftDiv.className = 'd-flex align-items-center';
        leftDiv.classList.add('ModalBodyLeftImage');

        const modalImage = document.createElement('img');
        modalImage.src = item.image01;
        modalImage.classList.add('ModelBodyProductImage');
        modalImage.id = `ModelBodyProductImage_${item.productID}`;

        leftDiv.appendChild(modalImage);

        // 右側資訊
        const rightDiv = document.createElement('div');
        rightDiv.className = 'w-100';
        rightDiv.style.padding = '20px';

        const productName = document.createElement('h3');
        productName.className = 'mb-3 d-flex';
        productName.textContent = item.name;

        // 我的最愛按鈕
        const favoriteButton = document.createElement('button');
        favoriteButton.className = 'btn mb-4 ms-auto fs-5';
        favoriteButton.setAttribute('data-ProductID', item.productID);
        favoriteButton.onclick = function () { HeartIconChange(this); };

        const heartIcon = document.createElement('i');
        heartIcon.className = 'bi bi-heart';
        heartIcon.style.color = '#ffffff';
        heartIcon.id = `ModalHeartIcon_${item.productID}`;

        favoriteButton.appendChild(heartIcon);

        // 商品資訊
        const priceInfo = document.createElement('p');
        priceInfo.textContent = `價格:${item.price}`;

        const stockInfo = document.createElement('p');
        stockInfo.textContent = `是否有貨:`;

        const stockButton = document.createElement('div');
        item.stock > 0 ? stockButton.classList.add('BtnOrange') : stockButton.classList.add('BtnOrangeDisabled');
        stockButton.textContent = item.stock > 0 ? '有貨' : '缺貨';
        stockInfo.appendChild(stockButton);

        const detailInfo = document.createElement('p');
        detailInfo.textContent = '詳細資訊:';

        const detailText = document.createElement('p');
        detailText.textContent = `${item.productDetails}`;

        //Modal footer
        const modelFooter = document.createElement('div');
        modelFooter.className = 'modal-footer d-flex';

        const footerImages = document.createElement('div');
        footerImages.className = 'd-flex';
        footerImages.classList.add('ModalFooterImages');

        const footerImgLeft = document.createElement('img');
        footerImgLeft.className = 'card-img';
        footerImgLeft.src = item.image01;
        footerImgLeft.classList.add('FooterImage');
        footerImgLeft.id = `FooterImgLeft_${item.productID}`;

        const footerImgMiddle = document.createElement('img');
        footerImgMiddle.className = 'card-img';
        footerImgMiddle.src = item.image02;
        footerImgMiddle.classList.add('FooterImage');
        footerImgMiddle.id = `FooterImgMiddle_${item.productID}`;

        const footerImgRight = document.createElement('img');
        footerImgRight.className = 'card-img';
        footerImgRight.src = item.image03;
        footerImgRight.classList.add('FooterImage');
        footerImgRight.id = `FooterImgRight_${item.productID}`;

        footerImages.appendChild(footerImgLeft);
        footerImages.appendChild(footerImgMiddle);
        footerImages.appendChild(footerImgRight);

        const footerCartButton = document.createElement('button');
        footerCartButton.className = 'btn ms-auto';
        footerCartButton.classList.add('CartButton');
        footerCartButton.setAttribute('data-ProductID', item.productID);
        footerCartButton.setAttribute('data-Name', item.name);
        footerCartButton.setAttribute('data-Price', item.price);
        footerCartButton.setAttribute('data-Discount', item.discount);
        footerCartButton.setAttribute('data-Image', item.image01);
        footerCartButton.setAttribute('data-Stock', item.stock);
        footerCartButton.onclick = function () { AddToCart(this); };
        footerCartButton.disabled = item.stock <= 0;
        footerCartButton.innerText = '加入購物車';

        modelFooter.appendChild(footerImages);
        modelFooter.appendChild(footerCartButton);

        productName.appendChild(favoriteButton);
        rightDiv.appendChild(productName);
        rightDiv.appendChild(priceInfo);
        rightDiv.appendChild(stockInfo);
        rightDiv.appendChild(detailInfo);
        rightDiv.appendChild(detailText);

        modalBody.appendChild(leftDiv);
        modalBody.appendChild(rightDiv);

        modalContent.appendChild(modalHeader);
        modalContent.appendChild(modalBody);
        modalContent.appendChild(modelFooter);
        modalDialog.appendChild(modalContent);
        modalDiv.appendChild(modalDialog);

        productContainer.appendChild(modalDiv);

        //捕捉modal打開事件使footer圖片可點擊更換主圖
        document.getElementById(`ProductModal_${item.productID}`).addEventListener('shown.bs.modal', function () {
            document.getElementById(`FooterImgLeft_${item.productID}`).addEventListener('click', function () {
                document.getElementById(`ModelBodyProductImage_${item.productID}`).src = item.image01
            });
            document.getElementById(`FooterImgMiddle_${item.productID}`).addEventListener('click', function () {
                document.getElementById(`ModelBodyProductImage_${item.productID}`).src = item.image02
            });
            document.getElementById(`FooterImgRight_${item.productID}`).addEventListener('click', function () {
                document.getElementById(`ModelBodyProductImage_${item.productID}`).src = item.image03
            });
        });

        const modals = document.getElementById(`ProductModal_${item.productID}`);
        var modal = new bootstrap.Modal(modals);
        // 視窗變動關閉modal
        window.addEventListener('resize', function () {
            modal.hide();           
        });
    });
    addCssIsolationElement();
}

function updatePagination(totalPages, currentPage) {
    const paginationContainer = document.querySelector('.pagination');
    paginationContainer.innerHTML = '';

    // 添加上一頁按鈕
    const backPageButton = document.createElement('li');
    backPageButton.className = 'page-item';
    const backPageButtonLink = document.createElement('a');
    backPageButtonLink.className = 'page-link';
    backPageButtonLink.classList.add('PageButton');
    backPageButtonLink.innerHTML = '&laquo;';
    backPageButtonLink.onclick = () => fetchProducts(currentPage - 1);
    backPageButton.appendChild(backPageButtonLink);
    paginationContainer.appendChild(backPageButton);

    // 顯示頁碼
    for (let i = 1; i <= totalPages; i++) {
        const numberPageButton = document.createElement('li');
        numberPageButton.className = 'page-item';
        numberPageButton.classList.add('nextPageButton');
        const numberPageButtonLink = document.createElement('a');
        numberPageButtonLink.classList.add('page-link');
        if (i === currentPage) {
            numberPageButtonLink.classList.add('numberPageButtonLinkTake');
        } else {
            numberPageButtonLink.classList.add('numberPageButtonLink');
        }
        numberPageButtonLink.innerText = i;
        numberPageButtonLink.onclick = () => fetchProducts(i);

        numberPageButton.appendChild(numberPageButtonLink);
        paginationContainer.appendChild(numberPageButton);
    }

    // 添加下一頁按鈕
    const nextPageButton = document.createElement('li');
    nextPageButton.className = 'page-item';
    const nextPageButtonLink = document.createElement('a');
    nextPageButtonLink.className = 'page-link';
    nextPageButtonLink.classList.add('PageButton');
    nextPageButtonLink.innerHTML = '&raquo;';
    nextPageButtonLink.onclick = () => fetchProducts(currentPage + 1);
    nextPageButton.appendChild(nextPageButtonLink);
    paginationContainer.appendChild(nextPageButton);

    addCssIsolationElement();
}
