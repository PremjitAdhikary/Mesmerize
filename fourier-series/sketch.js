const SQUARE = 1;
const SAW_TOOTH = 2;
const PULSE = 3;
const TRIANGLE = 4;

let circleColor;
let lineColor;

let canvas;
let angle;
let wave;
let number = 15;
let waveType = TRIANGLE;

function setup() {
  canvas = createCanvas(640, 480);
  canvas.parent('sketch-holder');
  circleColor = SketchColor.yellow().stringify();
  lineColor = SketchColor.greenyellow().stringify();
  init();
}

function init() {
  angle = 0;
  wave = [];
}

function draw() {
  background(0);
  translate(200, height / 2);

  let x = 0;
  let y = 0;

  for (let i=0; i<number; i++) {
    let prevX = x;
    let prevY = y;

    let a = calculateA();
    let b = calculateB(i);
    let c = calculateC(b);
    let r = calculateR();

    let radius = r * (a / (c * PI));

    x += radius * cos(b * angle);
    y += radius * sin(b * angle);

    drawEpiCircles(prevX, prevY, radius, x, y);
  }

  wave.unshift(y);
  if (wave.length > 240) {
    wave.pop();
  }

  drawCurve(x, y);
  angle -= 0.05;
}

function calculateA() {
  switch(waveType) {
    case SQUARE: return 4;
    case SAW_TOOTH: return 2;
    case PULSE: return -1;
    case TRIANGLE: return 4;
  }
  return 0;
}

function calculateB(i) {
  switch(waveType) {
    case SQUARE:
      return (i*2 + 1);
    case SAW_TOOTH:
      return i+1;
    case PULSE:
      return i;
    case TRIANGLE:
      return (i*2 + 1) * (i%2 == 0 ? 1 : -1);
  }
  return 0;
}

function calculateC(b) {
  switch(waveType) {
    case SQUARE: return b;
    case SAW_TOOTH: return b;
    case PULSE: return 1;
    case TRIANGLE: return b * b;
  }
  return 0;
}

function calculateR() {
  switch(waveType) {
    case SQUARE: return 75;
    case SAW_TOOTH: return 90;
    case PULSE: return 50;
    case TRIANGLE: return 120;
  }
  return 0;
}

function drawEpiCircles(prevX, prevY, radius, x, y) {
  stroke(circleColor);
  strokeWeight(1);
  noFill();
  circle(prevX, prevY, abs(radius)*2);

  stroke(lineColor);
  line(prevX, prevY, x, y);

  strokeWeight(5);
  point(x, y);
}

function drawCurve(x, y) {
  translate(200, 0);
  stroke(lineColor);
  strokeWeight(1);
  line(x - 200, y, 0, wave[0]);

  beginShape();
  stroke(curveColor());
  strokeWeight(2);
  noFill();
  for (let i=0; i < wave.length; i++) {
    vertex(i, wave[i]);
  }
  endShape();
}

function curveColor() {
  switch(waveType) {
    case SQUARE: return SketchColor.blend(SketchColor.violet(),SketchColor.white()).stringify();
    case SAW_TOOTH: return SketchColor.blend(
        SketchColor.blue(),SketchColor.green(),SketchColor.white()).stringify();;
    case PULSE: return SketchColor.red().stringify();;
    case TRIANGLE: return SketchColor.blend(SketchColor.orange(),SketchColor.white()).stringify();;
  }
  return 0;
}

// controls
function setBus(bus) {
  bus.register("ControlFSC", e => setWave(e.detail) );
  bus.register("ControlFSN", e => setNumber(e.detail) );
}

function setWave(d) {
  waveType = d.wave;
  init();
}

function setNumber(d) {
  number = d.number;
  init();
}

function setData(d) {
  waveType = d.wave;
  number = d.number;
}