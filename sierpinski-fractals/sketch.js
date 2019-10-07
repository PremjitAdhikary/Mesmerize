let canvas;

let choice;
let fractal;

function setup() {
  canvas = createCanvas(640, 480);
  canvas.parent('sketch-holder');
  frameRate(2);
  choice = 1;
  fractal = getFractal();
  init();
}

function draw() {
  background(0);
  fractal.show();
}

function getFractal() {
  switch(choice) {
    case 1: return new SierpinskiTriangle(7, SketchColor.red().stringify(), height, true);
    case 2: return new SierpinskiTriangle(8, SketchColor.yellow().stringify(), height * 0.9, 
          true, true);
    case 3: return new SierpinskiCarpet(5, SketchColor.violet().stringify(), height * 0.9, true);
    case 4: return new SierpinskiGasket(8, SketchColor.greenyellow().alpha50().stringify(), 
          SketchColor.greenyellow().stringify(), height, false);
    case 5: return new SierpinskiGasket(8, SketchColor.greenyellow().alpha50().stringify(), 
          SketchColor.greenyellow().stringify(), height, true);
  }
}

function init() {
  fractal.reset();
}

function mouseClicked() {
  if (mouseInCanvas()) {
    init();
  }
}

function setBus(bus) {
  bus.register("ControlSFC", e => setChoice(e.detail) );
}

function setChoice(d) {
  setData(d);
  fractal = getFractal();
  init();
}

function setData(d) {
  choice = d.choice;
}