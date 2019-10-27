let canvas;
let choice;

let numerator;
let denominator;
let offset;
let scale;

let maurer_n;
let maurer_d;
let maurer_scale = 230;

let vertices;
let curveBuilders;

function buildRoseCurve() {
  let k = numerator/denominator;
  for (let angle=0; angle <= TWO_PI*denominator; angle+= 0.02) {
    let r = scale * (cos(k*angle) + offset);
    let x = r * cos(angle);
    let y = r * sin(angle);
    vertices.push(createVector(x,y));
  }
}

function buildMaurerCurve() {
  for (let angle=0; angle <= 360; angle++) {
    let k = angle * maurer_d;
    let r = maurer_scale * sin(radians(k*maurer_n));
    let x = r * cos(radians(k));
    let y = r * sin(radians(k));
    vertices.push(createVector(x,y));
  }
}

function setup() {
  canvas = createCanvas(640, 480);
  canvas.parent('sketch-holder');
  curveBuilders = [buildRoseCurve, buildMaurerCurve];
  noLoop();
  init();
}

function init() {
  angle = 0;
  vertices = [];
  scale = map(offset,0,2,180,50);
  redraw();
}

function draw() {
  background(0);
  drawGrid();
  translate(width/2,height/2);
  curveBuilders[choice-1]();
  drawCurve();
}

function drawGrid() {
  stroke(SketchColor.gold().stringify());
  strokeWeight(1);
  noFill();
  line(10,height/2,width-10,height/2);
  line(width/2,height-10,width/2,10);
}

function drawCurve() {
  stroke(SketchColor.greenyellow().stringify());
  strokeWeight(choice == 1 ? 2 : 1);
  beginShape();
  for(let v of vertices) vertex(v.x,v.y);
  endShape();
}

function setBus(bus) {
  bus.register("ControlRcr", e => {
    choice = e.detail.choice;
    init();
  });
  bus.register("ControlRns", e => {
    numerator = e.detail.numerator;
    init();
  });
  bus.register("ControlRds", e => {
    denominator = e.detail.denominator;
    init();
  });
  bus.register("ControlRos", e => {
    offset = e.detail.offset;
    init();
  });
  bus.register("ControlRmns", e => {
    maurer_n = e.detail.maurer_numerator;
    init();
  });
  bus.register("ControlRmds", e => {
    maurer_d = e.detail.maurer_denominator;
    init();
  });
}

function setData(d) {
  choice = d.choice;
  numerator = d.numerator;
  denominator = d.denominator;
  offset = d.offset;
  maurer_n = d.maurer_numerator;
  maurer_d = d.maurer_denominator;
}