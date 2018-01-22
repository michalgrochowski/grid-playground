(function(){
    // Service worker registeration

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./serviceworker.js')
        .then(function(registration) {
            console.log('Service worker registration done, scope is:', registration.scope);
        })
        .catch(function(error) {
            console.log('Service worker registration failed, error:', error);
        });
    }

    // Turn off body overflow

    const APP_BODY = document.getElementById("body");

    function overflow() {
        APP_BODY.classList.toggle("overflow-on");
        APP_BODY.classList.toggle("overflow-off");
    }

    // Random background-color of grid items

    const GRID_ITEMS = document.getElementsByClassName("grid-item");

    // Get rgb color from random number

    function getRandomBackground() {
        let hexColor = Math.floor(Math.random() * 0xFFFFFF);
        return "#" + ("000000" + hexColor.toString(16)).substr(-6);
    }

    // Function that transforms rgb color value to object with properties of red, blue and green

    function changeRgbToObject(colorString) {
        const RGB_KEYS = ['r', 'g', 'b'];
        let rgbObj = {};
        let color = colorString.replace(/^rgb?\(|\s+|\)$/g,'').split(',');
        for (let i in RGB_KEYS)
            rgbObj[RGB_KEYS[i]] = color[i] || 1;
        return rgbObj;
    }

    // Change font color based on a background-color using HSP algorithm to determine brightness

    function changeFontColor(bgColor) {
        let colorObject = changeRgbToObject(bgColor);
        let rInteger = parseInt(colorObject.r);
        let gInteger = parseInt(colorObject.g);
        let bInteger = parseInt(colorObject.b);
        function brightness() {
            let rValue = rInteger * rInteger * 0.299;
            let gValue = gInteger * gInteger * 0.587;
            let bValue = bInteger * bInteger * 0.114;
            let sum = Math.sqrt(rValue + gValue + bValue);
            return Math.trunc(sum);
        }
        if (brightness() < 120) {
            return "rgb(255,255,255)";
        } else if (brightness() >= 120) {
            return "rgb(0,0,0);";
        }
    }

    // Change node background and font color

    function changeItemsBackground() {
        for (let item of GRID_ITEMS) {
            item.style.backgroundColor = getRandomBackground();
        }
        let itemLabel = document.getElementsByClassName("grid-item__label");
        for (let item of itemLabel) {
            item.style.color = changeFontColor(item.parentNode.parentNode.style.backgroundColor);
        }
        let deleteButton = document.getElementsByClassName("grid-item__button--delete");
        for (let item of deleteButton) {
            item.style.color = changeFontColor(item.parentNode.style.backgroundColor);
        }
        let applyButton = document.getElementsByClassName("grid-item__button--apply");
        for (let item of applyButton) {
            item.style.color = changeFontColor(item.parentNode.style.backgroundColor);
        }
    }

    // Function that changes grid item properties based on values in item inputs

    function changeGridItemProperties(item) {
        let columnStartValue = item.parentNode.querySelector(".grid-item__label--column-start").querySelector(".gridColumnStart").value;
        let columnEndValue = item.parentNode.querySelector(".grid-item__label--column-end").querySelector(".gridColumnEnd").value;
        let rowStartValue = item.parentNode.querySelector(".grid-item__label--row-start").querySelector(".gridRowStart").value;
        let rowEndValue = item.parentNode.querySelector(".grid-item__label--row-end").querySelector(".gridRowEnd").value;
        item.parentNode.style.gridColumnStart = columnStartValue;
        item.parentNode.style.gridColumnEnd = columnEndValue;
        item.parentNode.style.gridRowStart = rowStartValue;
        item.parentNode.style.gridRowEnd = rowEndValue;
    }

    // Change standard inputs value on mobile

    function changeGridValuesInInputs() {
        if (window.matchMedia("(min-width: 801px)").matches) {
            GRID_COLUMNS.setAttribute("value", "3");
            GRID_ROWS.setAttribute("value", "3");
            COLUMN_GAP.setAttribute("value", "10px");
            ROW_GAP.setAttribute("value", "10px");
        } else if (window.matchMedia("(max-width: 800px)").matches) {
            GRID_COLUMNS.setAttribute("value", "2");
            GRID_ROWS.setAttribute("value", "3");
            COLUMN_GAP.setAttribute("value", "5px");
            ROW_GAP.setAttribute("value", "5px");
        } 
    }

    window.addEventListener("resize", () => {
        changeGridValuesInInputs();
    });

    document.addEventListener("DOMContentLoaded", () => {
        changeItemsBackground();
        changeGridValuesInInputs();
    });

    // Expand grid options menu

    const OPTIONS_BUTTON = document.getElementById("optionsButton");
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
    const GRID_COLUMN_SIZE = document.getElementById("gridColumnSize");
    const GRID_ROW_SIZE = document.getElementById("gridRowSize");
    const COLUMN_GAP = document.getElementById("gridColumnGap");
    const ROW_GAP = document.getElementById("gridRowGap");
    const AUTOFLOW = document.getElementById("gridAutoFlow");
    const GRID_OPTIONS_APPLY = document.getElementById("gridOptionsApply");

   GRID_OPTIONS_APPLY.addEventListener("click", () => {
        OPTIONS_BOX.classList.toggle("grid-options--expanded");
        let columnsNumber = GRID_COLUMNS.value;
        let columnsSize = GRID_COLUMN_SIZE.value;
        let rowsNumber = GRID_ROWS.value;
        let rowsSize = GRID_ROW_SIZE.value;
        let columnGap = COLUMN_GAP.value;
        let rowGap = ROW_GAP.value;
        let autoFlow = AUTOFLOW.value;
        GRID.style.height = GRID_HEIGHT.value;
        GRID.style.width = GRID_WIDTH.value;
        GRID.style.gridTemplateColumns = `repeat(${columnsNumber},${columnsSize})`;
        GRID.style.gridTemplateRows = `repeat(${rowsNumber}, ${rowsSize})`;
        GRID.style.gridColumnGap = `${columnGap}`;
        GRID.style.gridRowGap = `${rowGap}`;
        GRID.style.gridAutoFlow = `${autoFlow}`;
    });

    // Add a new grid item

    const ADD_ITEM = document.getElementById("addGridItem");

    ADD_ITEM.addEventListener("click", () => {
        let newItem = document.createElement("div");
        newItem.classList.add("grid-item");
        let newDeleteButton = document.createElement("button");
        newDeleteButton.classList.add("grid-item__button");
        newDeleteButton.classList.add("grid-item__button--delete");
        newDeleteButton.textContent = "Delete ";
        let newDeleteIcon = document.createElement("span");
        newDeleteIcon.classList.add("icon-cancel");
        let newApplyButton = document.createElement("button");
        newApplyButton.classList.add("grid-item__button");
        newApplyButton.classList.add("grid-item__button--apply");
        newApplyButton.textContent = "Apply ";
        let newApplyIcon = document.createElement("span");
        newApplyIcon.classList.add("icon-ok");
        let newForm = document.createElement("form");
        newForm.classList.add("grid-item__options");
        let newLabel = document.createElement("label");
        newLabel.classList.add("grid-item__label");
        function createNewLabelAndInput(labelClass, inputClass, labelText) {
            let newLabel = document.createElement("label");
            newLabel.classList.add("grid-item__label");
            newLabel.classList.add(labelClass);
            let newInput = document.createElement("input");
            newInput.classList.add("grid-item__input");
            newInput.classList.add(inputClass);
            newInput.setAttribute("type", "text");
            newLabel.textContent = labelText;
            newLabel.appendChild(newInput);
            return newLabel;
        }
        newDeleteButton.appendChild(newDeleteIcon);
        newApplyButton.appendChild(newApplyIcon);
        newItem.appendChild(newDeleteButton);
        newItem.style.backgroundColor = getRandomBackground();
        newForm.appendChild(createNewLabelAndInput("grid-item__label--column-start", "gridColumnStart", "grid-column-start:"));
        newForm.appendChild(createNewLabelAndInput("grid-item__label--column-end", "gridColumnEnd", "grid-column-end:"));
        newForm.appendChild(createNewLabelAndInput("grid-item__label--row-start", "gridRowStart", "grid-row-start:"));
        newForm.appendChild(createNewLabelAndInput("grid-item__label--row-end", "gridRowEnd", "grid-row-end:"));
        newItem.appendChild(newForm);
        newItem.appendChild(newApplyButton);
        let newlabels = newItem.querySelectorAll(".grid-item__label");
        for (let item of newlabels) {
            let newColor = changeFontColor(item.parentNode.parentNode.style.backgroundColor);
            item.style.color = newColor;
            newDeleteButton.style.color = newColor;
            newApplyButton.style.color = newColor;
        }
        newDeleteButton.addEventListener("click", () => {
            newDeleteButton.parentNode.remove();
        });
        newApplyButton.addEventListener("click", () => {
            changeGridItemProperties(newApplyButton);
        });
        GRID.appendChild(newItem);
    });

    // Remove selected grid item

    const REMOVE_ITEM = document.getElementsByClassName("grid-item__button--delete");
    const REMOVE_ITEM_ICON = document.getElementsByClassName("icon-cancel");

    for (let item of REMOVE_ITEM) {
        item.addEventListener("click", (event) => {
            event.target.parentNode.remove();
        });
    }

    for (let item of REMOVE_ITEM_ICON) {
        item.addEventListener("click", (event) => {
            event.target.parentNode.parentNode.remove();
        });
    }

    // Change grid item properties on click

    const GRID_ITEM_APPLY = document.getElementsByClassName("grid-item__button--apply");

    for (let item of GRID_ITEM_APPLY) {
        item.addEventListener("click", () => {
            changeGridItemProperties(item);
        });
    }
    
    // Show the help modal

    const HELP_BUTTON = document.getElementById("showHelp");
    const HELP_MODAL = document.getElementById("helpModal");
    const CLOSE_MODAL = document.getElementById("closeModal");
    
    HELP_BUTTON.addEventListener("click", () => {
        HELP_MODAL.classList.add("grid-options__help-box--visible");
        overflow();
    });

    CLOSE_MODAL.addEventListener("click", () => {
        HELP_MODAL.classList.remove("grid-options__help-box--visible");
        overflow();
    });

})();