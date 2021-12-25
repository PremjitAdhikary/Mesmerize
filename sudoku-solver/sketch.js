let canvas;

let choice_game;
let speed;

const CELL_SIZE = 45;

let board;
let choice_algo;
let games;
let ops;
let opsIndex;
let state;
let cellInitColor;
let lineColor;

const INITIALIZE = 1;
const INITIALIZING = 2;
const INITIALIZED = 3;
const ANIMATING = 4;
const DONE = 5;

function setup() {
  canvas = createCanvas(640, 480);
  canvas.parent('sketch-holder');
  lineColor = SketchColor.greenyellow().stringify();
  cellInitColor = SketchColor.greenyellow().alpha(0.6).stringify();
  games = new Games();
  state = INITIALIZE;
}

function draw() {
  background(0);
  switch(state) {
    case INITIALIZE:
      state = INITIALIZING;
      strokeWeight(1);
      stroke(lineColor);
      fill(lineColor);
      textSize(35);
      textFont('Courier New');
      let tw = textWidth('Processing...');
      text('Processing...', width/2 - tw/2, height/2);
      return;
    case INITIALIZING:
      init();
      state = INITIALIZED;
      return;
    case INITIALIZED:
      if (board) board.draw();
      return;
    case ANIMATING:
      for (let i=0; i<speed && opsIndex<ops.length; i++, opsIndex++) {
        ops[opsIndex]();
      }
      board.draw();
      drawProgress();
      return;
  }
}

function init() {
  board = new SudokuBoard();
  let g = getGame();
  board.initialize(g);
  let input = clone2DArray(g);
  ops = [];
  if (choice_algo == 1)
    ops = Backtracking.solve(input, board);
  else if (choice_algo == 2)
    ops = MostConstrainedSquareSelection.solve(input, board);
  console.log(ops.length);
  opsIndex = 0;
}

function getGame() {
  switch(choice_game) {
    case 1: return games.randomEasy();
    case 2: return games.randomNormal();
    case 3: return games.randomHard();
    case 4: return games.bruteForceKiller();
  }
}

function drawProgress() {
  strokeWeight(1);
  stroke(lineColor);
  fill(0);
  rect (width/2 - 75, 460, 150, 8);
  let p = map(opsIndex, 0, ops.length, 0, 150);
  fill(lineColor);
  rect (width/2 - 75, 460, p, 8);
  fill(lineColor);
}

function setBus(bus) {
  bus.register("ControlSSblg", e => {
    choice_game = e.detail.choice_game;
    state = INITIALIZE;
  });
  bus.register("ControlSSbsg", e => {
    state = ANIMATING;
  });
  bus.register("ControlSSca", e => {
    choice_algo = e.detail.choice_algo;
    state = INITIALIZE;
  });
  bus.register("ControlSSrs", e => {
    speed = e.detail.speed;
  });
}

function setData(d) {
  choice_game = d.choice_game;
  choice_algo = d.choice_algo;
  speed = d.speed;
}