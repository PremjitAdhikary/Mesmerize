let canvas;

let puzzles = [];
let board;

let BOARD_COLOR;

function preload() {
  puzzles.push(
    { thumb: loadImage('./img/games/Rocket.jpg'), actual: loadImage('./img/games/Rocket.jpg') }, 
    { thumb: loadImage('./img/games/Ship.jpg'), actual: loadImage('./img/games/Ship.jpg') }, 
    { thumb: loadImage('./img/games/Village.jpg'), actual: loadImage('./img/games/Village.jpg') }, 
    { thumb: loadImage('./img/games/Superheroes.jpg'), actual: loadImage('./img/games/Superheroes.jpg') }
  );
}

function setup() {
  canvas = createCanvas(640, 480);
  canvas.parent('sketch-holder');
  BOARD_COLOR = (new SketchColor(211,211,211)).stringify();
  setupBoard();
}

function setupBoard() {
  let puzzle = random(puzzles);
  board = new PuzzleBoard(puzzle.thumb, puzzle.actual);
  board.jumble();
}

function draw() {
  background(0);
  board.show(mouseX, mouseY);
}

function mouseClicked() {
  if (!board.areCoordinatesOnMovableTile(mouseX, mouseY)) return;
  board.moveTileAtCoordinates(mouseX, mouseY);
}

function setBus(bus) {
  bus.register("ControlSPbj", () => board.jumble());
  bus.register("ControlSPbr", () => setupBoard());
}