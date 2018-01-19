(function(){
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/serviceworker.js').then(function(registration) {
          console.log('ServiceWorker registration successful!');
        }).catch(function(err) {
          console.log('ServiceWorker registration failed: ', err);
        });
    }

    // Turn off body overflow

    function overflow() {
        pageBody = document.getElementById("body");
        pageBody.classList.toggle("overflow-on");
        pageBody.classList.toggle("overflow-off");
    }

    // Random background-color of grid items

    const GRID_ITEMS = document.getElementsByClassName("grid-item");

    function getRandomBackground() {
        let hex = Math.floor(Math.random() * 0xFFFFFF);
        return "#" + ("000000" + hex.toString(16)).substr(-6);
    }

    function changeRgbToObject(colorString) {
        const rgbKeys = ['r', 'g', 'b'];
        let rgbObj = {};
        let color = colorString.replace(/^rgb?\(|\s+|\)$/g,'').split(',');
        for (let i in rgbKeys)
            rgbObj[rgbKeys[i]] = color[i] || 1;
        return rgbObj;
    }

    function changeFontColor(bgColor) {
        let colorObject = changeRgbToObject(bgColor)
        rInteger = parseInt(colorObject.r);
        gInteger = parseInt(colorObject.g);
        bInteger = parseInt(colorObject.b);
        function brightness() {
            rValue = rInteger * rInteger * 0.299;
            gValue = gInteger * gInteger * 0.587;
            bValue = bInteger * bInteger * 0.114;
            let sum = Math.sqrt(rValue + gValue + bValue);
            return Math.trunc(sum);
        }
        if (brightness() < 100) {
            return "rgb(255,255,255)";
        } else if (brightness() >= 100) {
            return "rgb(0,0,0);"
        }
    }

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
    }

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
        let newForm = document.createElement("form");
        newForm.classList.add("grid-item__options");
        let newLabel = document.createElement("label");
        newLabel.classList.add("grid-item__label");
        function createNewLabelAndInput(labelClass, inputClass, labelText, newBackground) {
            let newLabel = document.createElement("label");
            newLabel.classList.add("grid-item__label");
            newLabel.classList.add(labelClass);
            let newInput = document.createElement("input");
            newInput.classList.add("grid-item__input");
            newInput.classList.add(inputClass);
            newInput.setAttribute("type", "text");
            newInput.addEventListener("change", function() {
                let gridOptionValue = newInput.value;
                if (newInput.classList.contains("gridColumnStart")) {
                    newInput.parentNode.parentNode.parentNode.style.gridColumnStart = `${gridOptionValue}`;
                } else if (newInput.classList.contains("gridColumnEnd")) {
                    newInput.parentNode.parentNode.parentNode.style.gridColumnEnd = `${gridOptionValue}`;
                } else if (newInput.classList.contains("gridRowStart")) {
                    newInput.parentNode.parentNode.parentNode.style.gridRowStart = `${gridOptionValue}`;
                } else if (newInput.classList.contains("gridRowEnd")) {
                    newInput.parentNode.parentNode.parentNode.style.gridRowEnd = `${gridOptionValue}`;
                };
            })
            newLabel.textContent = labelText;
            newLabel.appendChild(newInput);
            return newLabel;
        }
        newDeleteButton.appendChild(newDeleteIcon);
        newItem.appendChild(newDeleteButton);
        newItem.style.backgroundColor = getRandomBackground();
        newForm.appendChild(createNewLabelAndInput("grid-item__label--column-start", "gridColumnStart", "grid-column-start:", newItem.style.backgroundColor));
        newForm.appendChild(createNewLabelAndInput("grid-item__label--column-end", "gridColumnEnd", "grid-column-end:", newItem.style.backgroundColor));
        newForm.appendChild(createNewLabelAndInput("grid-item__label--row-start", "gridRowStart", "grid-row-start:", newItem.style.backgroundColor));
        newForm.appendChild(createNewLabelAndInput("grid-item__label--row-end", "gridRowEnd", "grid-row-end:", newItem.style.backgroundColor));
        newItem.appendChild(newForm);
        newDeleteButton.addEventListener("click", () => {
            newDeleteButton.parentNode.remove();
        });
        GRID.appendChild(newItem);
        changeItemsBackground();
    });

    // Remove selected grid item

    const REMOVE_ITEM = document.getElementsByClassName("grid-item__button--delete");

    for (let item of REMOVE_ITEM) {
        item.addEventListener("click", (event) => {
            event.target.parentNode.remove();
        });
    };

    // Change grid item properties

    const GRID_COLUMN_START = document.getElementsByClassName("gridColumnStart");
    const GRID_COLUMN_END = document.getElementsByClassName("gridColumnEnd");
    const GRID_ROW_START = document.getElementsByClassName("gridRowStart");
    const GRID_ROW_END = document.getElementsByClassName("gridRowEnd");

    for (let item of GRID_COLUMN_START) {
        item.addEventListener("change", (event) => {
            let gridOptionValue = event.target.value;
            event.target.parentNode.parentNode.parentNode.style.gridColumnStart = `${gridOptionValue}`;
        });
    }
    
    for (let item of GRID_COLUMN_END) {
        item.addEventListener("change", (event) => {
            let gridOptionValue = event.target.value;
            event.target.parentNode.parentNode.parentNode.style.gridColumnEnd = `${gridOptionValue}`;
        });
    }
    
    for (let item of GRID_ROW_START) {
        item.addEventListener("change", (event) => {
            let gridOptionValue = event.target.value;
            event.target.parentNode.parentNode.parentNode.style.gridRowStart = `${gridOptionValue}`;
        });
    }
    
    for (let item of GRID_ROW_END) {
        item.addEventListener("change", (event) => {
            let gridOptionValue = event.target.value;
            event.target.parentNode.parentNode.parentNode.style.gridRowEnd = `${gridOptionValue}`;
        });
    }
    
    // Show the help modal

    const HELP_BUTTON = document.getElementById("showHelp");
    const HELP_MODAL = document.getElementById("helpModal");
    const CLOSE_MODAL = document.getElementById("closeModal");
    
    HELP_BUTTON.addEventListener("click", () => {
        HELP_MODAL.classList.add("grid-options__help-box--visible");
        overflow();
    })

    CLOSE_MODAL.addEventListener("click", () => {
        HELP_MODAL.classList.remove("grid-options__help-box--visible");
        overflow();
    })

    // Change standard inputs value on mobile
    function changeGridValuesInInputs() {
        if (window.matchMedia("max-width: 800px")) {
            GRID_COLUMNS.setAttribute("value", "2");
            GRID_ROWS.setAttribute("value", "3");
            COLUMN_GAP.setAttribute("value", "5px");
            ROW_GAP.setAttribute("value", "5px");
        } else if (window.matchMedia("min-width: 801px")) {
            GRID_COLUMNS.setAttribute("value", "3");
            GRID_ROWS.setAttribute("value", "3");
            COLUMN_GAP.setAttribute("value", "10px");
            ROW_GAP.setAttribute("value", "10px");
        }
    }

    window.addEventListener("resize", () => {
        changeGridValuesInInputs();
    })

})();