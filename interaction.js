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