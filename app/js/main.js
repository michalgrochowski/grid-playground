(function(){
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/serviceworker.js').then(function(registration) {
          console.log('ServiceWorker registration successful!');
        }).catch(function(err) {
          console.log('ServiceWorker registration failed: ', err);
        });
    }

    // Random color grid-items

    const GRID_ITEMS = document.getElementsByClassName("grid-item");

    function getRandomBackground() {
        let hex = Math.floor(Math.random() * 0xFFFFFF);
        return "#" + ("000000" + hex.toString(16)).substr(-6);
    }

    function changeItemsBackground() {
        for (let item of GRID_ITEMS) {
            item.style.background = getRandomBackground();
        }
    }

    document.addEventListener("DOMContentLoaded", () => {
        changeItemsBackground();
    });

    // Expand grid options menu

    const OPTIONS_BUTTON = document.getElementById("options-button");
    const OPTIONS_BOX = document.getElementById("options-box");

    OPTIONS_BUTTON.addEventListener("click", () => {
        OPTIONS_BOX.classList.toggle("grid-options--expanded");
    });

    // Change gris properties using provided values from inputs

    const GRID = document.getElementById("grid");
    const GRID_COLUMNS = document.getElementById("gridColumns");
    const GRID_ROWS = document.getElementById("gridRows");

    NUMBER_OF_ITEMS.addEventListener("change", () => {
        GRID.style.gridColumn = "1fr 1fr 1fr";
    });
})();