const cells = [];
const connections = [];
bands = {
"The Strokes": {
"band": {
  "members": ["Julian Casablancas", "Albert Hammond Jr.", "Fabrizio Moretti"]
}
}
}
musicians = {
"Julian Casablancas": {
"musician": {
  "bands": ["The Strokes"]
}
},
"Albert Hammond Jr.": {
"musician": {
  "bands": ["The Strokes"]
},
"Fabrizio Moretti": {
"musician": {
  "bands": ["The Strokes"]
}}}}

function setup() {
createCanvas(800, 800);

const cellMap = {}; // Maps names to Cell instances

// Load bands
for (const [bandName, bandData] of Object.entries(bands)) {
let bandCell = new Cell(bandName, 'band', width / 2, height / 2); // Position band in the center
cells.push(bandCell);
cellMap[bandName] = bandCell;

// Calculate angles for musician nodes
const angleIncrement = TWO_PI / bandData.band.members.length;
let angle = 0;

for (const member of bandData.band.members) {
  if (!cellMap[member]) {
    const x = width / 2 + cos(angle) * 150; // 150 is the radius from the center
    const y = height / 2 + sin(angle) * 150;
    let musicianCell = new Cell(member, 'musician', x, y);
    cells.push(musicianCell);
    cellMap[member] = musicianCell;
    angle += angleIncrement;
  }
  connections.push(new Connection(bandCell, cellMap[member]));
}
}

// Load musicians (ensuring no duplicates)
for (const [musicianName, musicianData] of Object.entries(musicians)) {
if (!cellMap[musicianName]) {
  let musicianCell = new Cell(musicianName, 'musician');
  cells.push(musicianCell);
  cellMap[musicianName] = musicianCell;
}

// Connect musicians to bands
for (const band of musicianData.musician.bands) {
  if (cellMap[band]) {
    connections.push(new Connection(cellMap[band], cellMap[musicianName]));
  }
}
}
}

function draw() {
background(100);

connections.forEach(conn => {
if (conn.isInside(mouseX, mouseY)) conn.flags.hover = true;
else conn.flags.hover = false;

conn.render();
})

cells.forEach (cell => {
if (cell.isInside(mouseX, mouseY)) cell.flags.hover = true;
else cell.flags.hover = false;

cell.render();
});
}

let dx = 0;
let dy = 0;
let dragged_cell;

function mousePressed() {
for (let i = 0; i < connections.length; i++) {
conn = connections[i];
if (conn.flags.hover) {
  conn.flags.dragging = true;
  return;
}
}

for (let i = 0; i < cells.length; i++) {
cell = cells[i];
if (cell.flags.hover) {
  cell.flags.dragging = true;
  dragged_cell = cell;
  break;
}
}

if (!dragged_cell) return;
dx = mouseX - dragged_cell.x;
dy = mouseY - dragged_cell.y;
}

function mouseDragged() {
if (!dragged_cell) return;

dragged_cell.x = mouseX - dx;
dragged_cell.y = mouseY - dy;
}

function mouseReleased() {
if (!dragged_cell) return;

dragged_cell.flags.dragging = false;
dragged_cell = undefined;
}