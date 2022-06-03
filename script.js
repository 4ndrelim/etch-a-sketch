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
let isDisplayLines = false;
const mode = document.querySelector('#mode');
const erase = document.querySelector('#erase');
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
showLines.addEventListener('click', toggleDisplay);
document.body.onmousedown = () => {drawing = true;}
document.body.onmouseup = () => {drawing = false};


/*
Grid settings
*/
function clearGrid() { // helper for reloadGrid
    grid.innerHTML = '';
}

function reloadGrid() {
    clearGrid();
    createGrid(currentSize);
    currentDisplay();
}

/*
this helper function is called whenever clear grid/grid size updated but wanting grid lines to still display
*/
function currentDisplay() { 
    var divs = document.querySelectorAll('#grid div');
    if (isDisplayLines) {
        divs.forEach(e => e.style.border = '0.1px solid');
    } else {
        divs.forEach(e => e.style.border = '0px solid');
    }
}

function toggleDisplay() {
    var divs = document.querySelectorAll('#grid div');
    if (isDisplayLines) {
        showLines.classList.remove('active');
        divs.forEach(e => e.style.border = '0px solid');
    } else {
        showLines.classList.add('active');
        divs.forEach(e => e.style.border = '0.1px solid');
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

    updateSizeText(currentSize);
    sliderSize.value = DEFAULT_SIZE;

    colorPicker.reset();
    reloadGrid();
}

/*
Toggles between available modes - random, manual & eraser
*/
function erasing() {
    if (isErasing) {
        erase.classList.remove('active');
    } else {
        erase.classList.add('active');
    }
    isErasing = !isErasing;
}

function toggleGrid() {
    if (currentMode === MANUAL) {
        currentMode = RANDOM;
        mode.textContent = `Current: ${RANDOM}`
    } else {
        currentMode = MANUAL;
        mode.textContent = `Current: ${MANUAL}`
    }
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
        box.addEventListener('mouseover', applyColor);
        box.addEventListener('mousedown', applyColor); // ensures first box clicked will have color applied
        grid.appendChild(box);
    }
}

/*
apply color to a box in grid
*/
function applyColor(e) {
    if (drawing || e.type === "mousedown") {
        if (isErasing) {
            e.target.style.backgroundColor = ERASE_COLOR;
        }
        else if (currentMode === RANDOM) {
            var first = Math.floor(Math.random() * 256);
            var second = Math.floor(Math.random() * 256);
            var third = Math.floor(Math.random() * 256);
            e.target.style.backgroundColor = `rgb(${first}, ${second}, ${third})`;
        } else if (currentMode === MANUAL) {
            e.target.style.backgroundColor = currentColor;
        }
    }
}


window.onload = () => {
    createGrid(DEFAULT_SIZE)
}
