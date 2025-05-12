
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

function preload() {
  // Fetch data from the backend server #5000
  loadJSON('http://localhost:5000/api/data', (data) => {
    // Organize the data into the required structure
    data.bands.forEach(band => {
      bands[band.name] = {
        band: {
          members: band.members,
        },
      };
    });

    data.musicians.forEach(musician => {
      musicians[musician.name] = {
        musician: {
          bands: musician.bands,
        },
      };
    });

    // Call setup after data is loaded
    initializeCells();
  });
}

function gridLayout(bandNames) {
  print("Grid layout");
  
  let numBands = bandNames.length;

  let cols = Math.ceil(Math.sqrt(numBands)); // Number of columns in the grid layout using square root
  let rows = Math.ceil(numBands / cols); // Number of rows in the grid layout
  let cellWidth = frameWidth / cols; // Width of each cell
  let cellHeight = frameHeight / (rows * 0.5); // Height of each cell

  for (let i = 0; i < numBands; i++) {
    let bandName = bandNames[i];
    let col = i % cols; // Column index of the cell
    let row = Math.floor(i / cols); // Row index of the cell
    let x = (col + 0.5) * cellWidth; // X-coordinate of the cell
    let y = (row + 0.5) * cellHeight; // Y-coordinate of the cell

    let bandCell = new Cell(bandName, 'band', x, y);
    cells.push(bandCell);
    cellMap[bandName] = bandCell;
  }
}

function randomLayout(bandNames) {
  print("Random layout");
}




// Initialize cells and connections
function initializeCells() {
 // Maps names to Cell instances for easy lookup

  let bandNames = Object.keys(bands);

  // index only the first 5 bands
  bandNames = bandNames.slice(0, 10);


  if (layoutType === "grid") {
    gridLayout(bandNames);

  } else if (layoutType === "random") {
    randomLayout(bandNames);
  }
}

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



// Mouse pressed function: Handles the start of dragging
function mousePressed() {
  // reset the dragged cell
  dragged_cell = undefined;

  // Check if a cell is being dragged
  for (let i = 0; i < cells.length; i++) {
    cell = cells[i];
    if (cell.flags.hover) {
      cell.flags.dragging = true;
      dragged_cell = cell;

      // calculate the offset
      dx = mouseX - cell.x; 
      dy = mouseY - cell.y; 
      break;
    }
  }

  if (!dragged_cell) return;
}

function tryMoveCell(cell, newX, newY, allCells) {
  for (let other of allCells) {
    if (other !== cell) {
      let testCell = { x: newX, y: newY, radius: cell.radius || 40 }; // lightweight proxy
      let dx = testCell.x - other.x;
      let dy = testCell.y - other.y;
      let distSq = dx * dx + dy * dy;
      let minDist = (testCell.radius + (other.radius || 40) + 5) ** 2;
      if (distSq < minDist) {
        return; // Cancel move if overlapping
      }
    }
  }

  // Only set position if move is valid
  cell.x = newX;
  cell.y = newY;
}


// Mouse dragged function: Handles the dragging motion
function mouseDragged() {
  if (!dragged_cell) return;

  // Update the position of the dragged cell using the tryMoveCell function
  let newX = mouseX - dx;
  let newY = mouseY - dy;

  tryMoveCell(dragged_cell, newX, newY, cells);
}

// Mouse released function: Handles the end of dragging
function mouseReleased() {
  if (!dragged_cell) return;

  // Reset the dragging state
  dragged_cell.flags.dragging = false;
  dragged_cell = undefined;
}