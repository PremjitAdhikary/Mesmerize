let canvas;

let choice_game;

let configData;
let cells;
let rows;
let cols;
let cycle;
let cycleCount;
let wrap;

function preload() {
  configData = loadJSON('./cell-configs.json');
}

function setup() {
  canvas = createCanvas(640, 480);
  canvas.parent('sketch-holder');
  initCells();
}

function initCells() {
  config = configData[choice_game];
  cycle = config.cycle;
  cycleCount = 0;
  rows = config.rows;
  cols = config.cols;
  wrap = config.wrap;
  size = config.size,
  cells = create2DArray(rows, cols);
  if (config.type === 'full-screen') {
    forEach2DArray(cells, (cell, r, c) => {
      cells[r][c] = new TheCell(r,c,size,config.data[r].charAt(c) === 'x',30);
    });
  } else {
    forEach2DArray(cells, (cell, r, c) => {
      cells[r][c] = new TheCell(r,c,size,Math.random() > 0.5,30);
    });
  }
}

function draw() {
  background(0);
  renderCells();
  cycleCount ++;
  if (cycleCount >= cycle) {
    cycleCount = 0;
    updateCells();
  }
}

function renderCells() {
  forEach2DArray(cells, (cell) => {
    cell.render();
  });
}

function updateCells() {
  forEach2DArray(cells, (cell, r, c) => {
    cell.setStateForNextUpdate(evaluateRules(r,c));
  });
  forEach2DArray(cells, (cell) => {
    cell.updateState();
  });
}

function evaluateRules(r,c) {
  let count = getCountOfAliveNeighbors(r,c);
  return (cells[r][c].isAlive() && count >= 2 && count <= 3) 
    || (!cells[r][c].isAlive() && count === 3);
}

function getCountOfAliveNeighbors(r,c) {
  let count = 0;

  if (!wrap) {
    if (r-1>=0 && c-1>=0) (count += (cells[r-1][c-1].isAlive() ? 1 : 0));
    if (r-1>=0) (count += (cells[r-1][c].isAlive() ? 1 : 0));
    if (r-1>=0 && c+1<cols) (count += (cells[r-1][c+1].isAlive() ? 1 : 0));
  
    if (c-1>=0) (count += (cells[r][c-1].isAlive() ? 1 : 0));
    if (c+1<cols) (count += (cells[r][c+1].isAlive() ? 1 : 0));
    
    if (r+1<rows && c-1>=0) (count += (cells[r+1][c-1].isAlive() ? 1 : 0));
    if (r+1<rows) (count += (cells[r+1][c].isAlive() ? 1 : 0));
    if (r+1<rows && c+1<cols) (count += (cells[r+1][c+1].isAlive() ? 1 : 0));
  } else {
    count += (cells[(r-1+rows)%rows][(c-1+cols)%cols].isAlive() ? 1 : 0);
    count += (cells[(r-1+rows)%rows][c].isAlive() ? 1 : 0);
    count += (cells[(r-1+rows)%rows][(c+1+cols)%cols].isAlive() ? 1 : 0);

    count += (cells[r][(c-1+cols)%cols].isAlive() ? 1 : 0);
    count += (cells[r][(c+1+cols)%cols].isAlive() ? 1 : 0);

    count += (cells[(r+1+rows)%rows][(c-1+cols)%cols].isAlive() ? 1 : 0);
    count += (cells[(r+1+rows)%rows][c].isAlive() ? 1 : 0);
    count += (cells[(r+1+rows)%rows][(c+1+cols)%cols].isAlive() ? 1 : 0);
  }
  
  return count;
}

function setBus(bus) {
  bus.register("ControlGOLcrg", e => {
    choice_game = e.detail.choice_game;
    initCells();
  });
}

function setData(d) {
  choice_game = d.choice_game;
}