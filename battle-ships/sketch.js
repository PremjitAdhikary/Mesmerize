let canvas;
let scribble;
let game;
let mainMenu;
let bus;

let blueMark;
let redMark;
let blackMark;
let pencilMark;
let menuStroke;
let menuFill;
let buttonStroke;
let buttonFill;
let buttonTxtColor;
let txtColor;
let shipStroke;
let shipFill;
let hilightColor;

function preload() {
  blueMark = new SketchColor(0, 58, 166).stringify();
  redMark = new SketchColor(173, 54, 54).stringify();
  blackMark = new SketchColor(39, 39, 39).stringify();
  pencilMark = new SketchColor(162, 162, 162).stringify();
  menuStroke = new SketchColor(88, 170, 214).stringify();
  menuFill = new SketchColor(140, 215, 255).stringify();
  buttonStroke = new SketchColor(191, 116, 77).stringify();
  buttonFill = new SketchColor(255, 180, 140).stringify();
  buttonTxtColor = new SketchColor(150, 77, 39).stringify();
  txtColor = new SketchColor(6, 33, 84).stringify();
  shipStroke = new SketchColor(95, 95, 95).stringify();
  shipFill = new SketchColor(180, 180, 180).stringify();
  hilightColor = new SketchColor(250, 255, 92).alpha50().stringify();
}

function setup() {
  canvas = createCanvas(640, 480);
  canvas.parent('sketch-holder');
  scribble = new Scribble();
  mainMenu = new MainMenu();
  game = mainMenu;
  frameRate(8);
}

function draw() {
  randomSeed( 900 );
  background(235);
  game.show();
  stroke(0);
  strokeWeight(2);
}

function setBus(b) {
  bus = b;
  bus.register("ControlEInMn", e => {
    game = mainMenu;
  });
  bus.register("ControlEInCl", e => {
    game = new Classic(e.detail);
  });
  bus.register("ControlEInMi", e => {
    game = new Mini(e.detail);
  });
}

function mouseReleased() {
  if (mouseInCanvas()) {
    game.eventAt(mouseX, mouseY);
  }
}