document.addEventListener("DOMContentLoaded", function () {
    const tabs = document.querySelectorAll(".nav-item a");
    const contents = document.querySelectorAll(".tab-content");

    tabs.forEach(tab => {
        tab.addEventListener("click", function (e){
            e.preventDefault();

            tabs.forEach(t => t.classList.remove("active"));
            contents.forEach(c => c.classList.remove("active"));

            this.classList.add("active");
            const targetId = this.getAttribute("aria-controls");
            document.getElementById(targetId).classList.add("active");
        });
    });
});