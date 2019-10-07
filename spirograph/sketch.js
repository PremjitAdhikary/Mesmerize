let number_of_circles;
let canvas;
let headCircle;
let trace;
let baseAngleVelocity;

function setup() {
  canvas = createCanvas(640, 480);
  canvas.parent('sketch-holder');
  trace = false;
  baseAngleVelocity = 0.005;
  init();
}

function draw() {
  if (!trace) {
    background(0);
  }
  noFill();
  translate(width/2, height/2);
  headCircle.show();
}

function init() {
  background(0);
  headCircle = new ACircle(width/2, height/2, number_of_circles, 0, 
    baseAngleVelocity, trace);
}

function setBus(bus) {
  bus.register("ControlSG", e => {
    number_of_circles = e.detail.number_of_circles;
    init();
  } );
}

function setData(d) {
  number_of_circles = d.number_of_circles;
}

function mouseClicked() {
  if (mouseInCanvas()) {
    trace = !trace;
    init();
  }
}