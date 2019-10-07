let phi = 0;
let curve_a = 1;
let curve_b = 1;
let size_A = 1;
let size_B = 1;
let offset;
let canvas;

function setup() {
  canvas = createCanvas(640, 480);
  canvas.parent('sketch-holder');
  offset = height / 24;
}

function draw() {
  background(0);
  noFill();
  drawGuides();
  drawCurve();
  phi += 0.02;
}

function drawGuides() {
  stroke(SketchColor.greenyellow().alpha75().stringify());
  strokeWeight(1.5);
  line(offset, height / 2, width - offset, height / 2);
  line(width / 2, offset, width / 2, height - offset);
  
  stroke(SketchColor.greenyellow().stringify());
  strokeWeight(0.5);
  text(210,  width - offset - 20, height / 2 - 10);
  text(-210,  offset, height / 2 - 10);
  text(210,  width / 2 + 10, offset);
  text(-210,  width / 2 + 10, height - offset);
}

function drawCurve() {
  strokeWeight(1.5);
  stroke(SketchColor.yellow().stringify());
  beginShape();
  let angle = 0;
  while (angle <= TWO_PI) {
    let x = width/2 + size_A * sin(angle * curve_a + phi);
    let y = height/2 + size_B * sin(angle * curve_b);
    vertex(x, y);
    angle+=0.01;
  }
  endShape();
}

function setBus(bus) {
  bus.register("ControlLCTCca", e => {
    curve_a = e.detail.curve_a
  } );
  bus.register("ControlLCTCcb", e => {
    curve_b = e.detail.curve_b;
  });
  bus.register("ControlLCTCsA", e => {
    size_A = e.detail.size_A
  } );
  bus.register("ControlLCTCsB", e => {
    size_B = e.detail.size_B;
  });
}

function setData(d) {
  curve_a = d.curve_a;
  curve_b = d.curve_b;
  size_A = d.size_A;
  size_B = d.size_B;
}