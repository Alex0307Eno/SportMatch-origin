document.addEventListener("DOMContentLoaded", () => {
    let dataContainer = document.querySelector(".data-container");
    dataContainer.classList.add("dashboard");

    numberIncrease(value => {
        document.querySelector('.joinTeams').textContent = Math.floor(value);
    }, 0 ,5, 600);

    numberIncrease(value => {
        document.querySelector('.invitedTimes').textContent = Math.floor(value);
    }, 0 ,15, 600);
});

function numberIncrease (callback, from, to, duration) {
  let start = null,
      animate = timestamp => {
        start = start || timestamp;
        let progress = Math.min((timestamp - start) / duration, 1);
        callback(progress * (to - from) + from);
        if(progress < 1) {
            window.requestAnimationFrame(animate);
        }
      };
  window.requestAnimationFrame(animate);
}


// chart.js
let ctx = document.getElementById("myEventsReview");

new Chart(ctx, {
    type: 'bar', // 圖表類型
    data: {
        labels: ['🏀籃球', '🏐排球', '🏸羽球'],
        datasets: [{
            label: '已完成',
            data: [5, 7, 9],
            backgroundColor: [
               '#fd7e143b','#fd7e143b','#fd7e143b'
            ],
            borderColor: [
                '#fd7e14',
                '#fd7e14',
                '#fd7e14'
            ],
            borderWidth: 1,
            borderRadius: 32,
        }]
    },
    scales: {
        x: {
            title: {
                display: true,
                text: '運動種類',
                size: 18
            },
        },
        xAxes: [{
            barPercentage: 0.3,
            barThickness: 6,  // number (pixels) or 'flex'
            maxBarThickness: 8 // number (pixels)
        }],
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