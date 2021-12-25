let canvas;
let scribble;

let manager;
let bgColor = 225;
let lineColor;
let darkColor;
let greenColor;
let blueColor;
let burnColor;
let bus;
const SCRIBBLE = 'scr';
const OUTLINE = 'out';
const BASIC = 'bsc';
const BLUE_TEAM = 'bt';
const GREEN_TEAM = 'gt';
const OBJ_ON = 'on';
const OBJ_POP = 'pop';
const NORMAL = 'n';
const FAST = 'f';
const TEXT_FONT = 'Courier New';
let debug = false;
let audioOn = true;
let bgSoundOn = true;
let kModeOn = false;
let graphics = BASIC;
let speed = NORMAL;
const MIN_STRIP_HEALTH = 50;

function setup() {
  canvas = createCanvas(640, 480);
  canvas.parent('sketch-holder');
  lineColor = (new SketchColor(169,169,169)).stringify();
  darkColor = 20;
  greenColor = (new SketchColor(135, 171, 139)).stringify();
  blueColor = (new SketchColor(52, 101, 148)).stringify();
  fireColor = SketchColor.orange().stringify();
  burnColor = SketchColor.blend(SketchColor.orange(), SketchColor.yellow()).stringify();
  scribble = new Scribble();
  manager = new SceneManager();
  manager.addScene(PauseScreen);
  manager.showScene(Menu);
  debug = false;
}

function draw() {
  randomSeed( 900 );
  manager.draw();
  if (debug) showFrameRate();
}

function showFrameRate() {
  stroke(darkColor);
  strokeWeight(1);
  fill(darkColor);
  textSize(20);
  textFont('Courier New');
  text('FPS: ' + Math.floor(frameRate()), 10, 20);
}

function keyPressed() {
  manager.handleEvent("keyPressed");
}

function debugOn() {
  debug = true;
}

function debugOff() {
  debug = false;
}

function setBus(b) {
  bus = b;
  GameConfigs.CONFIGS;
  GOFactory.FACTORY.setBus(b);
}
