let canvas;

let _x = 0;
let _y = 0;

let coefficients = [
  {a: 0,    b: 0,    c: 0,    d:0.16, e:0, f:0,    ps:0.00, pe:0.01},
  {a: 0.85, b: 0.04, c:-0.04, d:0.85, e:0, f:1.6,  ps:0.01, pe:0.86},
  {a: 0.2,  b:-0.26, c: 0.23, d:0.22, e:0, f:1.6,  ps:0.86, pe:0.93},
  {a:-0.15, b: 0.28, c: 0.26, d:0.24, e:0, f:0.44, ps:0.93, pe:1.00}
];

let plot_speed;

function setup() {
  canvas = createCanvas(640, 480);
  canvas.parent('sketch-holder');
  init();
}

function init() {
  background(0);
  _x = 0;
  _y = 0;
}

function draw() {
  for (let i = 0; i < plot_speed; i++) {
    drawPoint();
    nextPoint();
  }
}

function drawPoint() {
  let px = map(_x, -2.1820, 2.6558, 0, width);
  let py = map(_y, 0, 9.9983, height, 0);
  stroke(SketchColor.gold().stringify());
  strokeWeight(1);
  point(px, py);
}

function nextPoint() {
  let r = random(1);
  let coeff = coefficients.find(c => (r > c.ps && r <= c.pe));
  _x = coeff.a*_x + coeff.b*_y + coeff.e;
  _y = coeff.c*_x + coeff.d*_y + coeff.f;
}

function setBus(bus) {
  bus.register("ControlBFs", e => {
    plot_speed = e.detail.plot_speed;
  });
}

function setData(d) {
  plot_speed = d.plot_speed;
}

function mouseClicked() {
  if (mouseInCanvas()) {
    init();
  }
}