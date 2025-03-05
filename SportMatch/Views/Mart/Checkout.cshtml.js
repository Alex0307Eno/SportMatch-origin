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
        CartContainer.innerHTML = "<h2 class='d-flex justify-content-center align-items-center mt-2'>購物車是空的</h2>";
        return;
    }
    else {
        CartContainer.innerHTML = "";
        // 顯示每個商品
        Cart.forEach(Item => {
            const ItemElement = document.createElement('div');
            ItemElement.innerHTML =
                `
             <div class="card CartItem bg-dark" style="border: 1px solid #ff5f00;">
                 <div class="row">
                     <div class="col-3 d-flex align-items-center" >
                         <img src="${Item.Image}" class="img-fluid mx-3" alt="商品圖片">
                     </div>
                     <div class="col-9">
                         <div class="card-body">
                             <h5 class="card-title mb-3">${Item.Name}</h5>
                             ${Item.Discount < 0 ? `<p><strong>折扣:&nbsp;</strong>&nbsp;${Item.Discount}&nbsp;%</p>` : `<p><strong>折扣:&nbsp;</strong></p>`}
                             <p><strong>價格:&nbsp;&nbsp;</strong>${Item.Price}</p>                             
                             <div class="d-flex justify-content-between">
                                 <button class="btn btn-light btn-sm w-25" style="background-color: #ff5f00;color: #ffffff;border:0px;" onclick="updateQuantity('${Item.ID}', -1)">-</button>
                                 <button class="btn btn-sm w-100" style="background-color: #202020;color:#ffffff;border: 1px solid #ff5f00;">${Item.Quantity}</button>
                                 <button class="btn btn-light btn-sm w-25" style="background-color: #ff5f00;color: #ffffff;border:0px;" onclick="updateQuantity('${Item.ID}', 1)">+</button>
                             </div>
                             <button class="btn btn-danger btn-sm mt-2" onclick="removeItem('${Item.ID}')">刪除</button>
                         </div>
                     </div>
                 </div>
             </div>
            `;
            CartContainer.appendChild(ItemElement);
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

