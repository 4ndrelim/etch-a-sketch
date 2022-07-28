const MANUAL = "manual";
const RANDOM = "random";
const DEFAULT_SIZE = 16;
const DEFAULT_COLOR = "#eeeeee";
const DEFAULT_MODE = MANUAL;
const ERASE_COLOR = "#ffffff";


let currentMode = DEFAULT_MODE;
let currentColor = DEFAULT_COLOR;
let currentSize = DEFAULT_SIZE;
let drawing = false;
let isErasing = false;
let togglingFreeze = false;
let hideFreezeDisplay = false;
let isDisplayLines = false;
const mode = document.querySelector('#mode');
const erase = document.querySelector('#erase');
const toggleFreeze = document.querySelector('#freeze');
const hideFreeze = document.querySelector('#hide-freeze');
const gridSize = document.querySelector('#grid-size');
const sliderSize = document.querySelector('#slider-size');
const showLines = document.querySelector('#grid-lines');
const clearButton = document.querySelector('#clear');
const makeDefault = document.querySelector('#default');
const grid = document.querySelector('#grid');

/*
Handles color toggling
*/
let colorIndicator = document.querySelector(".color-indicator");
const colorPicker = new iro.ColorPicker("#color-picker", {width: 180, color: DEFAULT_COLOR});
colorPicker.on('color:change', function(color) {
    colorIndicator.classList.add('active');
    var colorHex = color.hexString;
    colorIndicator.style.backgroundColor = colorHex;
    currentColor = colorHex;
})
colorPicker.on('input:end', function(color) {
    colorIndicator.classList.remove('active');
})


/*
Event listeners
*/
clearButton.addEventListener('click', reloadGrid);
sliderSize.onmousemove = (e) => updateSizeText(e.target.value);
sliderSize.onchange = (e) => updateGrid(e.target.value);
mode.addEventListener('click', toggleGrid);
makeDefault.addEventListener('click', revertDefault);
erase.addEventListener('click', erasing);
toggleFreeze.addEventListener('click', freezing);
hideFreeze.addEventListener('click', toggleFreezeDisplay);
showLines.addEventListener('click', toggleDisplay);
document.body.onmousedown = () => {drawing = true;}
document.body.onmouseup = () => {drawing = false};


/*
Grid settings
*/
function cleanGrid() { // helper for reloadGrid
    grid.innerHTML = '';
}

// this function is called when Clear button is clicked
// or when default button is clicked (helper function in revertDefault())
// NOTE: Because an entire new grid is created, no need to worry about the toggling 
//       of an element/div freeze state in the board!
function reloadGrid() {
    cleanGrid();
    createGrid(currentSize);
    currentDisplay();
}

// this helper function is called whenever clear grid/grid size updated but wanting grid lines to still display
function currentDisplay() { 
    var divs = document.querySelectorAll('#grid div');
    if (isDisplayLines) {
        divs.forEach(e => e.classList.add('grid-lines-active'));
    } else {
        divs.forEach(e => e.classList.remove('grid-lines-active'));
    }
}

function toggleDisplay() {
    var divs = document.querySelectorAll('#grid div');
    if (isDisplayLines) {
        showLines.classList.remove('active');
        divs.forEach(e => e.classList.remove('grid-lines-active'));
    } else {
        showLines.classList.add('active');
        divs.forEach(e => e.classList.add('grid-lines-active'));
    }
    isDisplayLines = !isDisplayLines;
}

function revertDefault() {
    currentMode = DEFAULT_MODE;
    mode.textContent = `Current: ${MANUAL}`

    currentColor = DEFAULT_COLOR;
    currentSize = DEFAULT_SIZE;
    
    // personal note: If you try to remove a class that the element isn't a member of, then classList.remove will do nothing.
    isErasing = false;
    erase.classList.remove('active');

    isDisplayLines = false;
    showLines.classList.remove('active');

    togglingFreeze = false;
    toggleFreeze.classList.remove('active');

    hideFreezeDisplay = false;
    hideFreeze.classList.remove('active');

    updateSizeText(currentSize);
    sliderSize.value = DEFAULT_SIZE;

    colorPicker.reset();
    reloadGrid();
}


/*
Toggles between available modes - random & manual, eraser, freeze
*/
function toggleGrid() {
    if (currentMode === MANUAL) {
        currentMode = RANDOM;
        mode.textContent = `Current: ${RANDOM}`
    } else {
        currentMode = MANUAL;
        mode.textContent = `Current: ${MANUAL}`
    }
}

function erasing() {
    if (isErasing) {
        erase.classList.remove('active');
    } else {
        erase.classList.add('active');
    }
    isErasing = !isErasing;
}

function freezing() {
    if (togglingFreeze) {
        toggleFreeze.classList.remove('active');
    } else {
        toggleFreeze.classList.add('active');
    }
    togglingFreeze = !togglingFreeze;
}


/*
Handles freeze display
*/
function toggleFreezeDisplay() {
    var divs = document.querySelectorAll('#grid div');
    if (hideFreezeDisplay) { // so want to un-hide freeze
        hideFreeze.classList.remove('active');
        divs.forEach(e => e.classList.contains('freeze-active') ? e.classList.remove('freeze-hide') : null);
    } else {
        hideFreeze.classList.add('active');
        divs.forEach(e => e.classList.contains('freeze-active') ? e.classList.add('freeze-hide') : null);
    }
    hideFreezeDisplay = !hideFreezeDisplay;
}


/*
Update grid display size and internal size
*/
function updateSizeText(value) {
    gridSize.textContent = `${value} x ${value}`;
}

function updateGrid(value) {
    currentSize = value;
    reloadGrid();
}


/*
initializes grid
*/
function createGrid(size) {
    grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`
    grid.style.gridTemplateRows = `repeat(${size}, 1fr)`
    for (let i = 0; i < size * size; i++) {
        var box = document.createElement('div');
        box.classList.add('box');
        box.addEventListener('mouseover', freezeOrColor);
        box.addEventListener('mousedown', freezeOrColor); // ensures first box clicked will have color applied
        grid.appendChild(box);
    }
}


/*
determines whether to freeze or color a pixel/box depending on state of toggleFreeze
*/
function freezeOrColor(e) {
    if (drawing || e.type === "mousedown") {
        if (togglingFreeze) {
            toggleFreezeState(e);
        } else {
            applyColor(e);
        }
    }
}


/*
toggles freeze state of an element; 
applying on an unfrozen element would freeze it
applying on a frozen element would unfreeze it
*/
function toggleFreezeState(e) {
    if (e.target.classList.contains('freeze-active')) {
        e.target.classList.remove('freeze-active');
    } else {
        e.target.classList.add('freeze-active');
    }
}


/*
apply color to a box in grid
*/
function applyColor(e) {
    if (!e.target.classList.contains('freeze-active')) { // make sure element isn't frozen
        if (isErasing) {
            e.target.style.backgroundColor = ERASE_COLOR;
        }
        else if (currentMode === RANDOM) {
            var base1 = 56;
            var base2 = 36;
            var base3 = 86;
            var first = Math.floor(Math.random() * (256 - base1)) + base1;
            var second = Math.floor(Math.random() * (256 - base2)) + base2;
            var third = Math.floor(Math.random() * (256 - base3)) + base3;
            e.target.style.backgroundColor = `rgb(${first}, ${second}, ${third})`;
        } else if (currentMode === MANUAL) {
            e.target.style.backgroundColor = currentColor;
        }
    }
}


window.onload = () => {
    createGrid(DEFAULT_SIZE);
    colorIndicator.style.backgroundColor = DEFAULT_COLOR; // correct display for default drawing color
}
