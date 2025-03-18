function TogglePaymentMethod() {
    // 取得結帳方式點擊事件
    var PaymentSelected = {
        ComeHomepay: document.getElementById('ComeHome').checked,
        Seveneleven: document.getElementById('Seveneleven').checked,
        Familymart: document.getElementById('Familymart').checked
    };
    // 取得取貨方式所有事件
    var Elements = {
        SevenElevenPickup: document.getElementById('SevenelevenPickup'),
        FamilyMartPickup: document.getElementById('FamilymartPickup'),
        HomeDeliveryPickup: document.getElementById('HomeDeliveryPickup'),

        SevenElevenStoreBtn: document.getElementById('SevenelevenPickupStore'),
        FamilyMartStoreBtn: document.getElementById('FamilymartPickupStore'),

        HomeDeliveryName: document.getElementById('HomeDeliveryName'),
        HomeDeliveryPhone: document.getElementById('HomeDeliveryPhone'),
        HomeDeliveryAddress: document.getElementById('HomeDeliveryAddress')
    };

    // 重置所有事件
    Elements.SevenElevenPickup.disabled =
        Elements.FamilyMartPickup.disabled =
        Elements.HomeDeliveryPickup.disabled =

        Elements.SevenElevenStoreBtn.disabled =
        Elements.FamilyMartStoreBtn.disabled =
        Elements.HomeDeliveryName.disabled =
        Elements.HomeDeliveryPhone.disabled =
        Elements.HomeDeliveryAddress.disabled =
        true;

    // 事件控制
    if (PaymentSelected.ComeHomepay) {
        Elements.SevenElevenPickup.checked =
            Elements.FamilyMartPickup.checked =
            Elements.HomeDeliveryPickup.disabled =
            Elements.HomeDeliveryName.disabled =
            Elements.HomeDeliveryPhone.disabled =
            Elements.HomeDeliveryAddress.disabled =
            false;

        Elements.HomeDeliveryPickup.checked =
            true

    } else if (PaymentSelected.Seveneleven) {
        Elements.FamilyMartPickup.checked =
            Elements.HomeDeliveryPickup.checked =
            Elements.SevenElevenPickup.disabled =
            Elements.SevenElevenStoreBtn.disabled =
            false;

        Elements.SevenElevenPickup.checked =
            true;

    } else if (PaymentSelected.Familymart) {
        Elements.SevenElevenPickup.checked =
            Elements.HomeDeliveryPickup.checked =
            Elements.FamilyMartPickup.disabled =
            Elements.FamilyMartStoreBtn.disabled =
            false;
        Elements.FamilyMartPickup.checked =
            true;
    }
}


// CSS隔離標籤
function addCssIsolationElement() {
    function cssIsolationElement() {
        for (let sheet of document.styleSheets) {
            for (let rule of sheet.cssRules) {           // 記得修改頁面標籤
                const match = rule.selectorText?.match(/\.CheckoutContainer\[(b-[^\]]+)\]/);
                if (match) { return match[1]; }
            }
        }
    }
    //console.log(cssIsolationElement())
    document.querySelectorAll('*').forEach(div => {
        div.setAttribute(cssIsolationElement(), '');
    });
}



// 購物車localstorage接收資料用
function LoadCart() {   
    const Cart = JSON.parse(localStorage.getItem("Cart")) || [];
    const CartContainer = document.getElementById("CartItem");
    const TotalPrice = document.getElementById('TotalPrice');
    const NoDiscountPrice = document.getElementById('NoDiscountPrice');
    console.log(Cart);

    // 如果購物車是空的
    if (Cart.length === 0) {
        CartContainer.innerHTML = "<h2 class='d-flex justify-content-center align-items-center m-5'>購物車是空的</h2>";
        return;
    }
    else {
        CartContainer.innerHTML = "";
        TotalPrice.innerHTML = "";
        NoDiscountPrice.innerHTML = "";
        let total = 0;
        let NoDiscount = 0;
        Cart.forEach(Item => {
            const ItemElement = document.createElement('div');
            ItemElement.className = 'card bg-dark';
            ItemElement.classList.add('CartItem');
            const rowDiv = document.createElement('div');
            rowDiv.className = 'row';

            // 左側圖片
            const colImage = document.createElement('div');
            colImage.className = 'col-3 d-flex align-items-center';
            const img = document.createElement('img');
            img.src = Item.Image01;
            img.className = 'img-fluid mx-3';
            img.alt = '商品圖片';
            colImage.appendChild(img);

            // 右側內容
            const colContent = document.createElement('div');
            colContent.className = 'col-9';
            const cardBody = document.createElement('div');
            cardBody.className = 'card-body';

            // 商品名稱
            const title = document.createElement('h5');
            title.className = 'card-title mb-3';
            title.innerText = Item.Name;
            cardBody.appendChild(title);

            // 商品折扣
            const discountText = document.createElement('p');
            discountText.textContent = `折扣: ${Item.Discount > 0 ? `${Item.Discount}%` : '無'}`;
            cardBody.appendChild(discountText);

            // 商品價格
            const priceText = document.createElement('p');
            priceText.textContent = `價格: ${Item.Price}`;
            cardBody.appendChild(priceText);

            // 數量操作
            const quantityDiv = document.createElement('div');
            quantityDiv.className = 'd-flex', 'justify-content-between';

            const btnPlus = document.createElement('button');
            btnPlus.className = 'btn btn-light btn-sm w-25';
            btnPlus.classList.add('btnPlusMinus');
            btnPlus.innerText = '-';
            btnPlus.onclick = () => updateQuantity(Item.ID, -1);

            const quantityText = document.createElement('div');
            quantityText.classList.add('quantityText');
            quantityText.innerText = Item.Quantity;

            const btnMinus = document.createElement('button');
            btnMinus.className = 'btn btn-light btn-sm w-25';
            btnMinus.classList.add('btnPlusMinus');
            btnMinus.innerText = '+';
            btnMinus.onclick = () => updateQuantity(Item.ID, 1);

            quantityDiv.appendChild(btnPlus);
            quantityDiv.appendChild(quantityText);
            quantityDiv.appendChild(btnMinus);

            // 刪除按鈕
            const btnRemove = document.createElement('button');
            btnRemove.className = 'btn btn-danger btn-sm mt-2';
            btnRemove.innerText = '刪除';
            btnRemove.onclick = () => removeItem(Item.ID);

            cardBody.appendChild(quantityDiv);
            cardBody.appendChild(btnRemove);
            colContent.appendChild(cardBody);

            rowDiv.appendChild(colImage);
            rowDiv.appendChild(colContent);

            ItemElement.appendChild(rowDiv);

            CartContainer.appendChild(ItemElement);


            const price = parseFloat(Item.Price);
            const discount = parseFloat(Item.Discount);
            // 無折扣
            NoDiscount += price;

            // 計算折扣
            const discountedPrice = price * ((100 - discount) / 100);            
            total += discountedPrice;
        });
        // 顯示總價格
        NoDiscountPrice.textContent = `${NoDiscount.toFixed(0)}元`
        TotalPrice.textContent = `${total.toFixed(0)}元`;

        addCssIsolationElement();
    }    
}

// 更新購物車商品數量
function updateQuantity(ItemID, Delta) {
    let Cart = JSON.parse(localStorage.getItem("Cart")) || [];
    const Item = Cart.find(Item => Item.ID === ItemID);
    if (Item) {
        Item.Quantity = Math.max(1, Item.Quantity + Delta);
        localStorage.setItem("Cart", JSON.stringify(Cart));
        LoadCart();
    }
}

// 刪除購物車中的商品
function removeItem(ItemID) {
    let Cart = JSON.parse(localStorage.getItem("Cart")) || [];
    Cart = Cart.filter(Item => Item.ID !== ItemID);
    localStorage.setItem("Cart", JSON.stringify(Cart));
    LoadCart();
}

// 頁面載入時顯示購物車
document.addEventListener('DOMContentLoaded', LoadCart);



// 生成訂單編號
function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
// 結帳
let checkoutNow = document.getElementById('checkoutNow');
checkoutNow.addEventListener('click', function () {    
    const Cart = JSON.parse(localStorage.getItem("Cart")) || [];
    let _billNumber = generateRandomString(10);
    const cartCheckoutData = Cart.map(Item => ({
        id: Item.ID,
        quantity: Item.Quantity,        
        billNumber: _billNumber
    }));

    fetchCheckout(cartCheckoutData);
});

// 發送資訊到交易用API
let regex = /^產品ID \d+ 庫存不足$/
function fetchCheckout(cartCheckoutData) {
    fetch('/api/checkout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(cartCheckoutData)
    })
        .then(response => response.json())
        .then(data => {
            // 成功獲取到回應後，處理返回的資料
            if (!regex.test(data.message)) {
                console.log('結帳成功，返回資料：', data);
                billPage(data);
            }
            else {
                console.log('結帳失敗：', data);
            }
        })
}

// 訂單頁
function billPage(data) {     
    const CheckoutTopContainer = document.getElementById("CheckoutTopContainer");
    const Cart = JSON.parse(localStorage.getItem("Cart")) || [];
    
    CheckoutTopContainer.innerHTML = "";
    localStorage.removeItem('Cart');

    const container = document.createElement('div');
    container.classList.add('container', 'mt-4');
    
    const orderFrame = document.createElement('div');
    orderFrame.classList.add('OrderFrame');
    
    const orderNumberSection = document.createElement('div');
    orderNumberSection.classList.add('OrderSection');
    const orderNumberHeading = document.createElement('h4');
    orderNumberHeading.textContent = `訂單編號: #${data[0].billNumber}`;
    orderNumberSection.appendChild(orderNumberHeading);
    
    const productListSection = document.createElement('div');
    productListSection.classList.add('OrderSection');
    const productListHeading = document.createElement('h4');
    productListHeading.textContent = '商品清單';
    productListSection.appendChild(productListHeading);

    const scrollableList = document.createElement('div');
    scrollableList.classList.add('ScrollableList');

    let totalPrice = 0;
    data.forEach(item => {
        totalPrice += (item.price * ((100 - item.discount) / 100));

        const orderItem = document.createElement('div');
        orderItem.classList.add('OrderItem');

        const itemHeading = document.createElement('h6');
        itemHeading.textContent = item.name;
        orderItem.appendChild(itemHeading);

        const itemDetails = document.createElement('div');
        itemDetails.classList.add('d-flex', 'justify-content-between');

        const quantity = document.createElement('span');
        quantity.textContent = `數量: ${item.quantity}`;
        itemDetails.appendChild(quantity);

        const price = document.createElement('span');
        price.textContent = `價格: ${item.price}`;
        itemDetails.appendChild(price);

        orderItem.appendChild(itemDetails);

        scrollableList.appendChild(orderItem);
    });

    productListSection.appendChild(scrollableList);

    const totalPriceSection = document.createElement('div');
    totalPriceSection.classList.add('OrderSection');
    const totalPriceHeading = document.createElement('h4');
    totalPriceHeading.textContent = `總價格: ${totalPrice}`;
    totalPriceSection.appendChild(totalPriceHeading);

    const paymentMethodSection = document.createElement('div');
    paymentMethodSection.classList.add('OrderSection');
    const shippingHeading = document.createElement('h4');    
    shippingHeading.textContent = `貨運資訊`;
    paymentMethodSection.appendChild(shippingHeading);
    const shippingMethod = document.createElement('p');
    shippingMethod.textContent = '貨運方式: 7-11取貨';
    paymentMethodSection.appendChild(shippingMethod);
    const paymentMethod = document.createElement('p');
    paymentMethod.textContent = '付款方式: ATM轉帳';
    paymentMethodSection.appendChild(paymentMethod);

    const buyerInfoSection = document.createElement('div');
    buyerInfoSection.classList.add('OrderSection');
    const buyerInfoHeading = document.createElement('h4');
    buyerInfoHeading.textContent = '訂購人資訊';
    buyerInfoSection.appendChild(buyerInfoHeading);

    const name = document.createElement('p');
    name.textContent = '姓名: 張三';
    buyerInfoSection.appendChild(name);

    const phone = document.createElement('p');
    phone.textContent = '電話: 0912345678';
    buyerInfoSection.appendChild(phone);

    const address = document.createElement('p');
    address.textContent = '地址: 台北市中正區某某路123號';
    buyerInfoSection.appendChild(address);

    const orderPageButtonSection = document.createElement('div');
    orderPageButtonSection.classList.add('OrderSection', 'd-flex', 'justify-content-end');
    const orderPageButton = document.createElement('div');
    orderPageButton.classList.add('OrderButton');
    orderPageButton.textContent = '前往訂單頁面';
    orderPageButtonSection.appendChild(orderPageButton);

    orderFrame.appendChild(orderNumberSection);
    orderFrame.appendChild(productListSection);
    orderFrame.appendChild(totalPriceSection);
    orderFrame.appendChild(paymentMethodSection);
    orderFrame.appendChild(buyerInfoSection);
    orderFrame.appendChild(orderPageButtonSection);

    container.appendChild(orderFrame);

    CheckoutTopContainer.appendChild(container);

    addCssIsolationElement();
}

const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
const popoverList = [...popoverTriggerList].map(popoverTriggerEl => {
    return new bootstrap.Popover(popoverTriggerEl, {
        trigger: 'hover',
        placement: 'top',
        container: 'body',
        html: true
    });
});
