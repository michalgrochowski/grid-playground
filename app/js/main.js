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
            item.style.backgroundColor = getRandomBackground();
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

    // Change grid properties using provided values from inputs

    const GRID = document.getElementById("grid");
    const GRID_WIDTH = document.getElementById("gridWidth");
    const GRID_HEIGHT = document.getElementById("gridHeight");
    const GRID_COLUMNS = document.getElementById("gridColumns");
    const GRID_ROWS = document.getElementById("gridRows");
    const COLUMN_GAP = document.getElementById("gridColumnGap");
    const ROW_GAP = document.getElementById("gridRowGap");
    const AUTOFLOW = document.getElementById("gridAutoFlow");

    GRID_HEIGHT.addEventListener("change", () => {
        GRID.style.height = GRID_HEIGHT.value;
    });

    GRID_WIDTH.addEventListener("change", () => {
        GRID.style.width = GRID_WIDTH.value;
    });

    GRID_COLUMNS.addEventListener("change", () => {
        let columnsNumber = GRID_COLUMNS.value;
        GRID.style.gridTemplateColumns = `repeat(${columnsNumber}, 1fr)`;
    });

    GRID_ROWS.addEventListener("change", () => {
        let rowsNumber = GRID_ROWS.value;
        GRID.style.gridTemplateRows = `repeat(${rowsNumber}, 1fr)`;
    });

    COLUMN_GAP.addEventListener("change", () => {
        let columnGap = COLUMN_GAP.value;
        GRID.style.gridColumnGap = `${columnGap}`;
    });

    ROW_GAP.addEventListener("change", () => {
        let rowGap = ROW_GAP.value;
        GRID.style.gridRowGap = `${rowGap}`;
    });

    AUTOFLOW.addEventListener("change", () => {
        let autoFlow = AUTOFLOW.value;
        GRID.style.gridAutoFlow = `${autoFlow}`;
    });

    // Add and remove grid items

    const ADD_ITEM = document.getElementById("addGridItem");

    ADD_ITEM.addEventListener("click", () => {
        let newItem = document.createElement("div");
        let editButton = document.createElement("button");
        let editIcon = document.createElement("span");
        newItem.classList.add("grid-item");
        editButton.classList.add("grid-item__edit");
        editIcon.classList.add("icon-cog");
        editButton.appendChild(editIcon);
        newItem.appendChild(editButton);
        GRID.appendChild(newItem);
    });

})();