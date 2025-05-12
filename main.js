
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

// Chat for the server side of things
//https://chat.deepseek.com/a/chat/s/5c8a5780-320e-40bb-a655-e426b033db11

let bands = {};
let musicians = {};

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

    // Create connections between band and musician cells
    // put the musician name in the cell 
    // bands[bandName].band.members.forEach(musician => {
    //   // log what a musician is
    //   console.log(musician);
    //   let musicianCell = cellMap[musician];
    //   if (!musicianCell) {
    //     musicianCell = new Cell(musician, 'musician');
    //     cells.push(musicianCell);
    //     cellMap[musician] = musicianCell;
    //   }

    //   connections.push(new Connection(bandCell, musicianCell));
    // });
  }
}

function randomLayout(bandNames) {
  print("Random layout");

  let numBands = bandNames.length;
  for (let i = 0; i < numBands; i++) {
    let bandName = bandNames[i];
    let x = random(frameWidth);
    let y = random(frameHeight);
    let bandCell = new Cell(bandName, 'band', x, y);
    cells.push(bandCell);
    cellMap[bandName] = bandCell;

  }
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

// Variables for dragging functionality
let dx = 0;
let dy = 0;
let dragged_cell;

// Mouse pressed function: Handles the start of dragging
function mousePressed() {
  // Check if a connection is being dragged
  for (let i = 0; i < connections.length; i++) {
    conn = connections[i];
    if (conn.flags.hover) {
      conn.flags.dragging = true;
      return;
    }
  }

  // Check if a cell is being dragged
  for (let i = 0; i < cells.length; i++) {
    cell = cells[i];
    if (cell.flags.hover) {
      cell.flags.dragging = true;
      dragged_cell = cell;
      break;
    }
  }

  if (!dragged_cell) return;

  // Calculate the offset between the mouse and the cell's position
  dx = mouseX - dragged_cell.x;
  dy = mouseY - dragged_cell.y;

  // If the dragged cell is a band, store the relative positions of musicians
  if (dragged_cell.type === 'band') {
    for (const musicianCell of cells) {
      if (musicianCell.type === 'musician') {
        musicianCell.relativeX = musicianCell.x - dragged_cell.x;
        musicianCell.relativeY = musicianCell.y - dragged_cell.y;
      }
    }
  }
}

// Mouse dragged function: Handles the dragging motion
function mouseDragged() {
  if (!dragged_cell) return;

  // Update the position of the dragged cell
  dragged_cell.x = mouseX - dx;
  dragged_cell.y = mouseY - dy;

  // If the dragged cell is a band, update musician positions smoothly
  if (dragged_cell.type === 'band') {
    for (const musicianCell of cells) {
      if (musicianCell.type === 'musician') {
        // Calculate target positions based on the band's new position
        const targetX = dragged_cell.x + musicianCell.relativeX;
        const targetY = dragged_cell.y + musicianCell.relativeY;

        // Smoothly interpolate toward the target positions
        musicianCell.x = lerp(musicianCell.x, targetX, 0.1); // 0.1 is the smoothing factor
        musicianCell.y = lerp(musicianCell.y, targetY, 0.1);
      }
    }
  }
}

// Mouse released function: Handles the end of dragging
function mouseReleased() {
  if (!dragged_cell) return;

  // Reset the dragging state
  dragged_cell.flags.dragging = false;
  dragged_cell = undefined;
}