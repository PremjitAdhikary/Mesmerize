let canvas;

let firstCircle;
let lastCircle;
let curve;

let choice;
let numberOfCircles;
let konstantMultiplier;
let konstant;
let ratio;
let resolution = 5;

function setup() {
  canvas = createCanvas(640, 480);
  canvas.parent('sketch-holder');
  init();
}

function init() {
  switch(choice) {
    case 1: outerCircleSpirograph(); break;
    case 2: innerCircleSpirograph(); break;
  }
  curve = [];
}

function outerCircleSpirograph() {
  let htMultiplier = map(ratio, 0.3, 0.5, 0.24,0.16);
  aCircleSpirograph(htMultiplier, EpiCircle.OUTSIDE);
}

function innerCircleSpirograph() {
  aCircleSpirograph(0.45, EpiCircle.INSIDE);
}

function aCircleSpirograph(htMultiplier, direction) {
  firstCircle = new EpiCircle(
    width/2, 
    height/2, 
    height*htMultiplier, 
    1, 
    null, 
    direction, 
    konstantMultiplier * konstant,
    ratio);
  let currentCircle = firstCircle;
  for (let i=0; i<numberOfCircles-1; i++) {
    currentCircle = currentCircle.addChild();
  }
  lastCircle = currentCircle;
}

function draw() {
  background(0);
  let currentCircle = firstCircle;
  for (let i=0; i<resolution; i++) {
    while(currentCircle != null) {
      if (i == 0) currentCircle.show();
      currentCircle.update();
      currentCircle = currentCircle._child;
    }
    if (!firstCircle._child._oneRevolution)
      curve.push(createVector(lastCircle._x, lastCircle._y));
  }
  drawCurve();
}

function drawCurve() {
  noFill();
  stroke(SketchColor.greenyellow().stringify());
  strokeWeight(2);
  beginShape();
  for (let v of curve) {
    vertex(v.x, v.y);
  }
  endShape();
}

function setBus(bus) {
  bus.register("ControlFCc", e => {
    choice = e.detail.choice;
    init();
  });
  bus.register("ControFCnoc", e => {
    numberOfCircles = e.detail.numberOfCircles;
    init();
  });
  bus.register("ControlFCckm", e => {
    konstantMultiplier = e.detail.konstantMultiplier;
    init();
  });
  bus.register("ControFCk", e => {
    konstant = e.detail.konstant;
    init();
  });
  bus.register("ControFCr", e => {
    ratio = e.detail.ratio;
    init();
  });
}

function setData(d) {
  choice = d.choice;
  numberOfCircles = d.numberOfCircles;
  konstantMultiplier = d.konstantMultiplier;
  konstant = d.konstant;
  ratio = d.ratio;
}