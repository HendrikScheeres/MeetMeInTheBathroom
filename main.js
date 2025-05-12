
//const height = window.innerHeight;
const width = window.innerWidth; // Set width to 80% of the window width
const height = window.innerHeight; // Set height to 80% of the window height
const frameWidth = width ; // the width and height of the frame the cells get drawn in
const frameHeight = height * 0.7; // the width and height of the frame the cells get drawn in

const layoutType = "grid"; // Set the layout to either "grid" or "random"
const cellMap = {};

// Arrays to store cells (bands and musicians) and connections between them
const cells = [];
const connections = [];

let bands = {};
let musicians = {};

// Variables for dragging functionality
let dx = 0;
let dy = 0;
let dragged_cell;


// Setup function: Initializes the canvas and creates cells and connections
function setup() {
  createCanvas(width, height);
  frameRate(30);
}

// Draw function: Renders the cells and connections on the canvas
function draw() {
  background(100);

  // Render cells and check for hover state
  cells.forEach(cell => {
    if (cell.isInside(mouseX, mouseY)) cell.flags.hover = true;
    else cell.flags.hover = false;

    cell.render();
  });

}






