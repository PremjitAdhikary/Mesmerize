let canvas;

let bgEnv;
let maxSpeed = 10;
let choice_env;

let infoColor;
let infoBGColor;

function setup() {
  canvas = createCanvas(640, 480);
  canvas.parent('sketch-holder');
  setupBackGroundEnvironment();
  infoBGColor = SketchColor.black().alpha50().stringify();
  infoColor = SketchColor.white().stringify();
}

function setupBackGroundEnvironment() {
  switch(choice_env) {
    case 1: 
      bgEnv = BgEnv.setupSlimForest();
      break;
    case 2: 
      bgEnv = BgEnv.setupForest();
      break;
    case 3: 
      bgEnv = BgEnv.setupStylizedForest();
      break;
  }
}

function draw() {
  background(0);
  if (!bgEnv.renderReady) {
    bgEnv.preRender();
  } else {
    bgEnv.showBackGround();
    bgEnv.showGround();
    bgEnv.showForeGround();
    checkAndRespondToMouseEvent();
  }
  info();
}

function checkAndRespondToMouseEvent() {
  if (!mouseInCanvas() || !mouseIsPressed) return;
  bgEnv.updateCX(getCharacterX());
}

function getCharacterX() {
  let speed = round(map(abs(width/2 - mouseX), 0, width/2, 0, maxSpeed));
  return ((mouseX > width/2) ? speed : -speed);
}

function info() {
  noStroke();
  strokeWeight(1);
  fill(infoBGColor);
  rect(5, 5, 170, 40);
  stroke(infoColor);
  fill(infoColor);
  text('FrameRate: '+frameRate().toFixed(2), 10, 20);
  text('Objects Loaded: '+bgEnv.objectsBuilt + ' of ' + bgEnv.totalObjectsToBuild, 10, 35);
}

function setBus(bus) {
  bus.register("ControlV50DENVce", e => {
    choice_env = e.detail.choice_env;
    setupBackGroundEnvironment();
  });
}

function setData(d) {
  choice_env = d.choice_env;
}