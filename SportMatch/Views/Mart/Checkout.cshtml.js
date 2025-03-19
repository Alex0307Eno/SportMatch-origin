function TogglePaymentMethod() {
    // 取得結帳方式點擊事件
    var PaymentSelected = {
        AtmLinepay: document.getElementById('Atm').checked || document.getElementById('Linepay').checked,
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
    if (PaymentSelected.AtmLinepay) {
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



// 購物車localstorage接收資料用
function LoadCart() {

    const Cart = JSON.parse(localStorage.getItem("Cart")) || [];
    const CartContainer = document.getElementById("CartItem");
    console.log(Cart);

    // 如果購物車是空的
    if (Cart.length === 0) {
        CartContainer.innerHTML = "<h2 class='d-flex justify-content-center align-items-center m-5'>購物車是空的</h2>";
        return;
    }
    else {
        CartContainer.innerHTML = "";
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
        });
        function existingElement() {
            for (let sheet of document.styleSheets) {
                for (let rule of sheet.cssRules) {
                    const match = rule.selectorText?.match(/\.CheckoutContainer\[(b-[^\]]+)\]/);
                    if (match) { return match[1]; }
                }
            }
        }
        document.querySelectorAll('.CartItem').forEach(div => {
            div.setAttribute(existingElement(), '');
        });
        document.querySelectorAll('.btnPlusMinus').forEach(div => {
            div.setAttribute(existingElement(), '');
        });
        document.querySelectorAll('.quantityText').forEach(div => {
            div.setAttribute(existingElement(), '');
        });
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

