// Arrays to store cells (bands and musicians) and connections between them
const cells = [];
const connections = [];


// Data structure for bands and their members
const bands = {
  "The Strokes": {
    "band": {
      "members": ["Julian Casablancas", "Albert Hammond Jr.", "Fabrizio Moretti", "Nick Valensi"]
    }
  }
};

// Data structure for musicians and the bands they belong to
const musicians = {
  "Julian Casablancas": {
    "musician": {
      "bands": ["The Strokes"]
    }
  },
  "Albert Hammond Jr.": {
    "musician": {
      "bands": ["The Strokes"]
    }
  },
  "Fabrizio Moretti": {
    "musician": {
      "bands": ["The Strokes"]
    }
  },
  "Nick Valensi": {
    "musician": {
      "bands": ["The Strokes"]
    }
  }
};


// Setup function: Initializes the canvas and creates cells and connections
function setup() {
    createCanvas(800, 800);
  
    const cellMap = {}; // Maps names to Cell instances for easy lookup
  
    // Load bands and create cells for them
    for (const [bandName, bandData] of Object.entries(bands)) {
      // Create a cell for the band and position it in the center of the canvas
      let bandCell = new Cell(bandName, 'band', width / 2, height / 2);
      cells.push(bandCell);
      cellMap[bandName] = bandCell;
  
      // Calculate angles for positioning musician nodes around the band
      const angleIncrement = TWO_PI / bandData.band.members.length;
      let angle = 0;
  
      // Create cells for each member of the band
      for (const member of bandData.band.members) {
        if (!cellMap[member]) {
          // Position musicians in a circle around the band
          const x = width / 2 + cos(angle) * 150; // 150 is the radius from the center
          const y = height / 2 + sin(angle) * 150;
          let musicianCell = new Cell(member, 'musician', x, y);
          cells.push(musicianCell);
          cellMap[member] = musicianCell;
          angle += angleIncrement;
        }
        // Create a connection between the band and the musician
        connections.push(new Connection(bandCell, cellMap[member]));
      }
    }
  
    // Load musicians and ensure no duplicates
    for (const [musicianName, musicianData] of Object.entries(musicians)) {
      if (!cellMap[musicianName]) {
        // Create a cell for the musician if it doesn't already exist
        let musicianCell = new Cell(musicianName, 'musician');
        cells.push(musicianCell);
        cellMap[musicianName] = musicianCell;
      }
  
      // Connect musicians to their bands
      for (const band of musicianData.musician.bands) {
        if (cellMap[band]) {
          connections.push(new Connection(cellMap[band], cellMap[musicianName]));
        }
      }
    }
  }
  
  // Draw function: Renders the cells and connections on the canvas
  function draw() {
    background(100);
  
    // Render connections and check for hover state
    connections.forEach(conn => {
      if (conn.isInside(mouseX, mouseY)) conn.flags.hover = true;
      else conn.flags.hover = false;
  
      conn.render();
    });
  
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