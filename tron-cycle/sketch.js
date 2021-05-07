let canvas;

let engine;
let menu;

let blue, orange;

let debug = false;

function setup() {
  canvas = createCanvas(640, 480);
  canvas.parent('sketch-holder');
  blue = new SketchColor(0,255,255);
  orange = new SketchColor(255,173,0);
  menu = new Menu(blue.copy());

  engine = menu;
}

function draw() {
  background(0);
  engine.show();
}

function keyPressed() {
  engine.input(keyCode);
}

function keyReleased() {
  engine.inputOff(keyCode);
}

function debugOn() {
  debug = true;
}

function debugOff() {
  debug = false;
}