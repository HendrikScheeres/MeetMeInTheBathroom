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
      createBand(bandName, x, y); // Create the band cell
  
  
    }
  }