let canvas;

let color;
let strokeWt;

let activeFunction;

let eyelidHeightMultiplierMax = 0.6;
let eyelidHeightMultiplier = 0;
let eyelidHeightMultiplierIncr = 0.01;

let irisHeightMultiplierMax = 0.5;
let irisHeightMultiplier = 0;
let irisHeightMultiplierIncr = 0.0075;
let irisAngle = 0;
let irisAngleSpeed = 0.05;

function setup() {
  canvas = createCanvas(640, 480);
  canvas.parent('sketch-holder');
  color = SketchColor.gold().stringify();
  strokeWt = 13;
  activeFunction = openEyelid;
}

function draw() {
  background(0);
  drawEyelid();
  activeFunction();
}

let openEyelid = function() {
  eyelidHeightMultiplier += eyelidHeightMultiplierIncr;
  if (eyelidHeightMultiplier >= eyelidHeightMultiplierMax) {
    activeFunction = openIris;
  }
}

let openIris = function() {
  drawIris();
  irisHeightMultiplier += irisHeightMultiplierIncr;
  irisAngle += irisAngleSpeed;
  if (irisHeightMultiplier >= irisHeightMultiplierMax) {
    activeFunction = closeIris;
  }
}

let closeIris = function() {
  drawIris();
  irisHeightMultiplier -= irisHeightMultiplierIncr;
  irisAngle += irisAngleSpeed;
  if (irisHeightMultiplier <= 0) {
    activeFunction = closeEyelid;
    irisAngle = 0;
  }
}

let closeEyelid = function() {
  eyelidHeightMultiplier -= eyelidHeightMultiplierIncr;
  if (eyelidHeightMultiplier <= 0) {
    activeFunction = openEyelid;
  }
}

function drawEyelid() {
  stroke(color);
  strokeWeight(strokeWt);
  noFill();
  ellipse(width/2, height/2, width*0.9, height*eyelidHeightMultiplier);
}

function drawIris() {
  let radius = height*irisHeightMultiplier;
  circle(width/2, height/2, radius);

  let x1 = width/2 + (radius/2 * cos(irisAngle));
  let y1 = height/2 + (radius/2 * sin(irisAngle));
  let x2 = width/2 - (radius/2 * cos(irisAngle));
  let y2 = height/2 - (radius/2 * sin(irisAngle));
  line(x1, y1, x2, y2);
  
  let x3 = width/2 - (radius/2 * sin(-irisAngle));
  let y3 = height/2 - (radius/2 * cos(-irisAngle));
  let x4 = width/2 + (radius/2 * sin(-irisAngle));
  let y4 = height/2 + (radius/2 * cos(-irisAngle));
  line(x3, y3, x4, y4);
}