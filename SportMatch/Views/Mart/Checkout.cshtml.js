let _selectedPaymentMethod = null;
let Cart = JSON.parse(localStorage.getItem("Cart")) || [];
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
        HomeDeliveryAddress: document.getElementById('HomeDeliveryAddress'),
        HomeDeliveryCity: document.getElementById('HomeDeliveryCity'),
        HomeDeliveryAllInfo: document.getElementById('HomeDeliveryAllInfo')

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
        Elements.HomeDeliveryCity.disabled =
        Elements.HomeDeliveryAllInfo.disabled =
        true;

    // 事件控制
    if (PaymentSelected.ComeHomepay) {
        Elements.SevenElevenPickup.checked =
            Elements.FamilyMartPickup.checked =
            Elements.HomeDeliveryPickup.disabled =
            Elements.HomeDeliveryName.disabled =
            Elements.HomeDeliveryPhone.disabled =
            Elements.HomeDeliveryAddress.disabled =
            Elements.HomeDeliveryCity.disabled =
            Elements.HomeDeliveryAllInfo.disabled =
            false;

        Elements.HomeDeliveryPickup.checked =
            true
        _selectedPaymentMethod = 'ComeHomepay';

        CheckoutRadioChange();

    } else if (PaymentSelected.Seveneleven) {
        Elements.FamilyMartPickup.checked =
            Elements.HomeDeliveryPickup.checked =
            Elements.SevenElevenPickup.disabled =
            Elements.SevenElevenStoreBtn.disabled =
            false;

        Elements.SevenElevenPickup.checked =
            true;
        _selectedPaymentMethod = 'Seveneleven';

        CheckoutRadioChange("");

    } else if (PaymentSelected.Familymart) {
        Elements.SevenElevenPickup.checked =
            Elements.HomeDeliveryPickup.checked =
            Elements.FamilyMartPickup.disabled =
            Elements.FamilyMartStoreBtn.disabled =
            false;
        Elements.FamilyMartPickup.checked =
            true;
        _selectedPaymentMethod = 'Familymart';

        CheckoutRadioChange("");

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
    const CartContainer = document.getElementById("CartItem");
    const TotalPrice = document.getElementById('TotalPrice');
    const NoDiscountPrice = document.getElementById('NoDiscountPrice');
    //console.log(Cart);

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
    const Item = Cart.find(Item => Item.ID === ItemID);
    if (Item) {
        Item.Quantity = Math.max(1, Item.Quantity + Delta);
        localStorage.setItem("Cart", JSON.stringify(Cart));
        LoadCart();
    }
}

// 刪除購物車中的商品
function removeItem(ItemID) {
    Cart = Cart.filter(Item => Item.ID !== ItemID);
    localStorage.setItem("Cart", JSON.stringify(Cart));
    updateCartNumber(); //_Layout.js
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

//檢查地址
function taiwanAddressCheck() {
    const addressRegex = /^(?=.*[A-Za-z0-9\u4e00-\u9fa5])([A-Za-z0-9\u4e00-\u9fa5]+(?:區|鄉|鎮|市)?(?:[巷弄街路大道街道段]\d{1,4})+號\d{1,4}.*)$/;
    const addressInput = document.getElementById('HomeDeliveryAddress');
    return addressRegex.test(addressInput.value);
}
function isCitySelected() {
    let homeDeliveryCity = document.getElementById('HomeDeliveryCity');
    let cityValue = homeDeliveryCity.value
    return cityValue.replace(/&nbsp;/g, '') && cityValue.replace(/&nbsp;/g, '') !== "-- 縣 --";
}

let HomeDeliveryName = document.getElementById('HomeDeliveryName');
let HomeDeliveryPhone = document.getElementById('HomeDeliveryPhone');
let HomeDeliveryAddress = document.getElementById('HomeDeliveryAddress');
let HomeDeliveryCity = document.getElementById('HomeDeliveryCity');
let HomeDeliveryAllInfo = document.getElementById('HomeDeliveryAllInfo');

function CheckoutRadioChange(_loggedInEmail = localStorage.getItem('loggedInEmail')) {
    var loggedInEmail = [{
        Email: _loggedInEmail
    }];

    fetch('/api/CheckoutRadio', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loggedInEmail)
    })
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                HomeDeliveryName.value = data[0].name;
                HomeDeliveryPhone.value = data[0].mobile;

                data.forEach(item => {
                    let option = document.createElement('option')
                    option.value = item.address;
                    option.text = item.recepient + " - " + item.phone + " - " + item.address;
                    HomeDeliveryAllInfo.appendChild(option);
                });
            }
            else
            {
                HomeDeliveryName.value = "";
                HomeDeliveryPhone.value = "";
                HomeDeliveryAddress.value = "";
                HomeDeliveryCity.value = "";

                HomeDeliveryAllInfo.innerHTML = '';

                let defaultOption = document.createElement('option');
                defaultOption.value = "";
                defaultOption.text = "-- 選取儲存的資訊 --";
                defaultOption.disabled = true;
                defaultOption.selected = true;
                HomeDeliveryAllInfo.appendChild(defaultOption);
            }
        })
}


document.getElementById('HomeDeliveryAllInfo').addEventListener('change', function () {
        var selectedOption = this.value; // 選中的地址
        if (selectedOption) {
            // 提取收件人姓名、電話和地址
            var optionText = this.selectedOptions[0].text;
            var addressParts = optionText.split(' - ');

            var recipient = addressParts[0];
            var phone = addressParts[1];
            var address = addressParts[2];

            // 填入姓名和電話
            document.getElementById('HomeDeliveryName').value = recipient;
            document.getElementById('HomeDeliveryPhone').value = phone;

            var cityPrefix = address.slice(0, 3); // 取得前三個字作為城市
            var citySelect = document.getElementById('HomeDeliveryCity');

            // 對應城市
            for (var i = 0; i < citySelect.options.length; i++) {
                if (citySelect.options[i].value === cityPrefix) {
                    citySelect.selectedIndex = i; // 城市選項
                    break;
                }
            }
            document.getElementById('HomeDeliveryAddress').value = address.slice(3);
        }
    });


    // 結帳
    let checkoutNow = document.getElementById('checkoutNow');
    checkoutNow.addEventListener('click', function () {
        let _billNumber = generateRandomString(10);
        let _loggedInEmail = localStorage.getItem('loggedInEmail');
        let _cityElemant = document.getElementById("HomeDeliveryCity");
        let _city = _cityElemant.value;
        let _addressElemant = document.getElementById("HomeDeliveryAddress");
        let _address = _addressElemant.value;
        let _userNameElement = document.getElementById('HomeDeliveryName')
        let _userName = _userNameElement.value;
        let _userMobileElement = document.getElementById('HomeDeliveryPhone')
        let _userMobile = _userMobileElement.value;

        const cartCheckoutData = Cart.map(Item => ({
            id: Item.ID,
            quantity: Item.Quantity,
            billNumber: _billNumber,
            email: _loggedInEmail,
            address: _city.replace(/&nbsp;/g, '') + _address,
            selectedPaymentMethod: _selectedPaymentMethod,
            userInputName: _userName,
            userInputMobile: _userMobile

        }));
        if (_selectedPaymentMethod === 'ComeHomepay') {
            if (!isCitySelected()) {
                console.log('結帳失敗：城市未選');
                alert('請選擇有效的城市');
                return;
            }
            if (!taiwanAddressCheck()) {
                console.log('結帳失敗：地址錯誤');
                alert('地址格式錯誤，請重新輸入');
                return;
            }
        }
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
                console.log(data);
                if (Cart.length <= 0) {
                    console.log('結帳失敗：商品未選');
                    alert('請先選擇商品');
                }
                else {
                    if (regex.test(data.message)) {
                        console.log('結帳失敗：', data);
                        alert(`產品"${data.name}"庫存不足，無法結帳`);
                        return;
                    }
                    if (!_selectedPaymentMethod) {
                        console.log('結帳失敗：結帳未選');
                        alert('請選擇結帳方式');
                        return;
                    }
                    if (data.message == "尚未登錄姓名") {
                        console.log('結帳失敗：姓名未登');
                        alert('尚未登錄姓名，請先填寫姓名');
                        return;
                    }
                    if (data.message == "姓名格式錯誤") {
                        console.log('結帳失敗：姓名格式錯誤');
                        alert('請以正確格式輸入姓名');
                        return;
                    }
                    if (data.message == "尚未登錄電話") {
                        console.log('結帳失敗：電話未登');
                        alert('尚未登錄電話，請先填寫電話');
                        return;
                    }
                    if (data.message == "電話格式錯誤") {
                        console.log('結帳失敗：手機號碼格式錯誤');
                        alert('請以正確格式輸入手機號碼');
                        return;
                    }
                    if (data.message == "未填寫完整收件資訊") {
                        console.log('結帳失敗：未填寫完整收件資訊');
                        alert('請填寫完整宅配用資訊');
                        return;
                    }
                    if (data.message == "未填寫會員姓名電話") {
                        console.log('結帳失敗：未填寫會員姓名電話');
                        alert('請至會員專區填寫會員姓名電話');
                        return;
                    }
                    console.log('結帳成功，返回資料：', data);
                    billPage(data);
                }
            })
            .catch(error => {
                console.error('結帳過程中發生錯誤:', error);
                alert('結帳過程中發生錯誤，請稍後再試');
            });
    }

    // 訂單頁
    function billPage(data) {
        const CheckoutTopContainer = document.getElementById("CheckoutTopContainer");

        CheckoutTopContainer.innerHTML = "";
        localStorage.removeItem('Cart');

        const container = document.createElement('div');
        container.classList.add('container', 'mb-4');

        const orderFrame = document.createElement('div');
        orderFrame.classList.add('OrderFrame');

        const orderNumberSection = document.createElement('div');
        orderNumberSection.classList.add('OrderSection');
        const orderNumberHeading = document.createElement('h4');
        orderNumberHeading.textContent = `訂單編號: #${data[0].billNumber}`;
        orderNumberSection.appendChild(orderNumberHeading);

        const productListSection = document.createElement('div');
        productListSection.classList.add('OrderSection');
        productListSection.id = 'productListSection';
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

        const paymentMethod = document.createElement('p');
        if (data[0].selectedPaymentMethod == 'ComeHomepay') {
            paymentMethod.textContent = '付款方式: 貨到付款';
        }
        else if (data[0].selectedPaymentMethod == 'Seveneleven') {
            paymentMethod.textContent = '付款方式: 7-11取貨付款';
        }
        else if (data[0].selectedPaymentMethod == 'Familymart') {
            paymentMethod.textContent = '付款方式: 全家取貨付款';
        }
        paymentMethodSection.appendChild(paymentMethod);

        const shippingMethod = document.createElement('p');
        if (data[0].selectedPaymentMethod == 'ComeHomepay') {
            shippingMethod.textContent = '貨運方式: 宅配到府';
        }
        else if (data[0].selectedPaymentMethod == 'Seveneleven') {
            shippingMethod.textContent = '貨運方式: 7-11取貨';
        }
        else if (data[0].selectedPaymentMethod == 'Familymart') {
            shippingMethod.textContent = '貨運方式: 全家取貨';
        }
        paymentMethodSection.appendChild(shippingMethod);

        const buyerInfoSection = document.createElement('div');
        buyerInfoSection.classList.add('OrderSection');
        const buyerInfoHeading = document.createElement('h4');
        buyerInfoHeading.textContent = '訂購人資訊';
        buyerInfoSection.appendChild(buyerInfoHeading);

        const name = document.createElement('p');
        name.textContent = `姓名: ${data[0].userName}`;
        buyerInfoSection.appendChild(name);

        const phone = document.createElement('p');
        phone.textContent = `電話: ${data[0].mobile}`;
        buyerInfoSection.appendChild(phone);

        const email = document.createElement('p');
        email.textContent = `信箱: ${data[0].email}`;
        buyerInfoSection.appendChild(email);

        const address = document.createElement('p');
        if (data[0].addres !== "") {
            address.textContent = `地址: ${data[0].address}`;
        }
        else {
            address.textContent = `地址: - `;
        }
        buyerInfoSection.appendChild(address);

        const orderPageButtonSection = document.createElement('div');
        orderPageButtonSection.classList.add('OrderSection', 'd-flex', 'justify-content-end');
        const orderPageButton = document.createElement('div');
        orderPageButton.classList.add('OrderButton');
        orderPageButton.textContent = '前往訂單頁面';
        orderPageButton.addEventListener('click', function () {
            window.location.href = '/MemberCenter/HistoryRecords';
        });
        orderPageButtonSection.appendChild(orderPageButton);

        orderFrame.appendChild(orderNumberSection);
        orderFrame.appendChild(productListSection);
        orderFrame.appendChild(totalPriceSection);
        orderFrame.appendChild(paymentMethodSection);
        orderFrame.appendChild(buyerInfoSection);
        orderFrame.appendChild(orderPageButtonSection);

        container.appendChild(orderFrame);

        CheckoutTopContainer.appendChild(container);

        updateCartNumber(); //_Layout.js
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

    // 7-11超取
    function electronicMapSeven() {
        const form = document.createElement('form');
        form.action = 'https://logistics-stage.ecpay.com.tw/Express/map';
        form.method = 'POST';

        const fields = [
            { name: 'MerchantID', value: '2000132' },
            { name: 'MerchantTradeNo', value: 'billNumber' },
            { name: 'LogisticsType', value: 'CVS' },
            { name: 'LogisticsSubType', value: 'UNIMART' },
            { name: 'IsCollection', value: 'N' },
            { name: 'ServerReplyURL', value: 'https://localhost:8888/Mart/Checkout' }
        ];

        fields.forEach(field => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = field.name;
            input.value = field.value;
            form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
    }

    // 全家超取
    function electronicMapFami() {
        const form = document.createElement('form');
        form.action = 'https://logistics-stage.ecpay.com.tw/Express/map';
        form.method = 'POST';

        const fields = [
            { name: 'MerchantID', value: '2000132' },
            { name: 'MerchantTradeNo', value: 'billNumber' },
            { name: 'LogisticsType', value: 'CVS' },
            { name: 'LogisticsSubType', value: 'FAMI' },
            { name: 'IsCollection', value: 'N' },
            { name: 'ServerReplyURL', value: 'https://localhost:8888/Mart/Checkout' }
        ];

        fields.forEach(field => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = field.name;
            input.value = field.value;
            form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
    }

