// 加上這頁的classname
document.addEventListener("DOMContentLoaded", () => {
    let dataContainer = document.querySelector(".data-container");
    dataContainer.classList.add("dashboard");
});

// chart.js
let ctx = document.getElementById("myEventsReview");
new Chart(ctx, {
    type: 'bar', // 圖表類型
    data: {
        labels: ['籃球', '排球', '羽球'],
        datasets: [{
            label: '已完成',
            data: [5, 7, 9],
            backgroundColor: [
                'rgba(255, 205, 86, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(201, 203, 207, 0.2)'
            ],
            borderColor: [
                'rgb(255, 205, 86)',
                'rgb(54, 162, 235)',
                'rgb(201, 203, 207)'
            ],
            borderWidth: 1
        }]
    },
    scales: {
        x: {
            title: {
                display: true,
                text: '運動種類'
            }
        },
        y: {
            title: {
                display: true,
                text: '賽事數量'
            },
            beginAtZero: true
        }
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        let value = tooltipItem.raw;
                        return `${tooltipItem.dataset.label}: ${value} 場`;
                    }
                }
            },
            legend: {
                display: false
            }
        }
    }
});