const DEFAULT_SIZE = 36;
const DEFAULT_MODE = "manual";
const MANUAL = "manual";
const RANDOM = "random";
const DEFAULT_COLOR = "fff";


let currentMode = DEFAULT_MODE;
let currentColor = DEFAULT_COLOR;
let currentSize = DEFAULT_SIZE;
let active = false;
const clearButton = document.querySelector('#clear');
const gridSize = document.querySelector('#grid-size');
const sliderSize = document.querySelector('#slider-size');
const grid = document.querySelector('#grid');
const mode = document.querySelector('#mode');

clearButton.addEventListener('click', reloadGrid);
sliderSize.onmousemove = (e) => updateSizeText(e.target.value);
sliderSize.onchange = (e) => updateGrid(e.target.value);
mode.addEventListener('click', toggleGrid);
document.body.onmousedown = () => {active = true;}
document.body.onmouseup = () => {active = false};

function clearGrid() {
    grid.innerHTML = '';
}

function reloadGrid() {
    clearGrid();
    createGrid(currentSize);
}

function toggleGrid() {
    reloadGrid();
    if (currentMode === MANUAL) {
        currentMode = RANDOM;
        mode.textContent = `Go ${MANUAL}`
    } else {
        currentMode = MANUAL;
        mode.textContent = `Go ${RANDOM}`
    }
}

function updateSizeText(value) {
    gridSize.textContent = `${value} x ${value}`;
}

function updateGrid(value) {
    currentSize = value;
    reloadGrid();
}

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

function applyColor(e) {
    if (active || e.type === "mousedown") {
        if (currentMode === RANDOM) {
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


/*
Handles color toggling
*/
let colorIndicator = document.querySelector(".color-indicator");
const colorPicker = new iro.ColorPicker("#color-picker", {width: 180, color: DEFAULT_COLOR});
colorPicker.on('color:change', function(color) {
    var colorHex = color.hexString;
    colorIndicator.style.backgroundColor = colorHex;
    currentColor = colorHex;
})