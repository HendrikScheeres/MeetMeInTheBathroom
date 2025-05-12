function initializeBands() {
    // Maps names to Cell instances for easy lookup
   
     let bandNames = Object.keys(bands);
   
     // index only the first 5 bands -> this doesn't work properly
     bandNames = bandNames.slice(0, 5);
   
   
     if (layoutType === "grid") {
       gridLayout(bandNames);
   
     } else if (layoutType === "random") {
       randomLayout(bandNames);
     }
   
   }

function createBand(bandName, x, y) {
    let bandCell = new Cell(bandName, 'band', x, y);
    cells.push(bandCell);
    cellMap[bandName] = bandCell; 
  
  }

