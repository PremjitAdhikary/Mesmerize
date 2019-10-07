let canvas;
let unit;
let curveUnit;
let offset = 20;
let angle = 0;
let cx;
let cy;
let px;
let py;
let markerColor;
let guideColor;
let sinColor;
let cosColor;
let sinCurve;
let cosCurve;
let choice;

function setup() {
  canvas = createCanvas(640, 480);
  canvas.parent('sketch-holder');
  unit = (height/2 - offset) / 2;
  curveUnit = width/7;
  cx = width/2;
  cy = height/4;
  markerColor = SketchColor.greenyellow().stringify();
  guideColor = SketchColor.yellow().stringify();
  sinColor = SketchColor.orange().stringify();
  cosColor = SketchColor.blend(SketchColor.violet(), SketchColor.white()).stringify();

  sinCurve = [];
  cosCurve = [];
}

function draw() {
  background(0);
  setMarkers();
  animate();
}

function setMarkers() {
  stroke(markerColor);
  strokeWeight(1);
  fill(markerColor);
  text('-1', width/2 - height/4, height/2 - height/4 - 5);
  text('1', width/2 + height/4 - 5, height/2 - height/4 - 5);
  text('-1', width/2 + 5, 10);
  text('1', width/2 + 5, height/2);
  text('1', 10, height/2 + offset);
  text('0', 10, height/2 + height/4);
  text('-1', 5, height - offset);
  text(PI_CHAR, width/2 - 15, height/2 + height/4 - 5);
  text('2'+PI_CHAR, width - 50, height/2 + height/4 - 5);

  line(width/2 - height/4, height/2 - height/4, width/2 + height/4, height/2 - height/4);
  line(width/2, 0, width/2, height/2);
  line(offset, height/2 + height/4, width - offset, height/2 + height/4);
  line(offset, height/2 + offset/2, offset, height - offset/2);

  strokeWeight(1);
  noFill();
  circle(cx, cy, unit * 2);
}

function animate() {
  px = unit * cos(angle);
  py = unit * sin(angle);
  drawSin();
  drawCos();
  drawPoint();
  angle -= 0.01;
  if (angle < -TWO_PI) {
    angle = 0;
    sinCurve = [];
    cosCurve = [];
  }
}

function drawPoint() {
  stroke(guideColor);
  strokeWeight(8);
  point(cx + px, cy + py);
}

function drawSin() {
  let curveX = offset + angle * curveUnit * -1;
  let curveY = height/2 + height/4 + py;
  sinCurve.push(createVector(curveX, curveY));
  if (choice == 1 || choice == 3) {
    drawGuide(sinColor, cx + px, height/4, cx + px, cy + py);
    drawCurve(sinColor, sinCurve);
    showVal(sinColor, 'Sin: '+sin(angle).toFixed(3), 20, 20);
  }
}

function drawCos() {
  let curveX = offset + angle * curveUnit * -1;
  let curveY = height/2 + height/4 + px;
  cosCurve.push(createVector(curveX, curveY));
  if (choice == 2 || choice == 3) {
    drawGuide(cosColor, width/2, cy + py, cx + px, cy + py);
    drawCurve(cosColor, cosCurve);
    showVal(sinColor, 'Cos: '+cos(angle).toFixed(3), 20, 40);
  }
}

function drawGuide(color, x1, y1, x2, y2) {
  stroke(color);
  strokeWeight(2);
  line(x1, y1, x2, y2);
}

function drawCurve(color, vectors) {
  stroke(color);
  strokeWeight(2);
  noFill();
  beginShape();
  for (let v of vectors) {
    vertex(v.x, v.y);
  }
  endShape();
  let guidePoint = vectors[vectors.length-1];
  strokeWeight(8);
  point(guidePoint.x, guidePoint.y);
}

function showVal(color, val, x, y) {
  strokeWeight(1);
  text(val, x, y);
}

function setBus(bus) {
  bus.register("ControlUC", e => setData(e.detail) );
}

function setData(d) {
  choice = d.choice;
}