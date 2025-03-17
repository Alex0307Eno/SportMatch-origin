document.addEventListener('DOMContentLoaded', function () {
    const cartCheckoutData = JSON.parse(sessionStorage.getItem('cartCheckoutData'));
    console.log('交易資料:', cartCheckoutData);
    fetchBill(cartCheckoutData);
});
function fetchBill(_cartCheckoutData) {
    // 發送 GET 請求到 API
    fetch('/api/Bill', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(_cartCheckoutData)
    })
        .then(response => response.json())
}