let canvas;

let choice;
let fractal;

function setup() {
  canvas = createCanvas(640, 480);
  canvas.parent('sketch-holder');
  frameRate(2);
  choice = 1;
  updateFractal();
  init();
}

function draw() {
  background(0);
  fractal.show();
}

function updateFractal() {
  fractal = getFractal(choice);
}

function init() {
  background(0);
  fractal.reset();
}

function getFractal() {
  switch(choice) {
    case 1: return new CantorSet();
    case 2: return new CantorSetLines();
    case 3: return new VicsekSnowflake();
    case 4: return new KochCurve();
    case 5: return new KochSnowFlake();
    case 6: return new KochAntiSnowFlake();
    case 7: return new CesaroAntiSnowFlake();
    case 8: return new MinkowskiCurve();
    case 9: return new MinkowskiSnowFlake();
  }
}

function mouseClicked() {
  if (mouseInCanvas()) {
    init();
  }
}

function setBus(bus) {
  bus.register("ControlMFC", e => setChoice(e.detail) );
}

function setChoice(d) {
  setData(d);
  updateFractal();
  init();
}

function setData(d) {
  choice = d.choice;
}