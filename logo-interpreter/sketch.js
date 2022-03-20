let canvas;

let turtle;
let ast;

function setup() {
  noLoop();
  canvas = createCanvas(640, 480);
  canvas.parent('sketch-holder');
  turtle = new TurtleEngine();
}

function draw() {
  background(0);
  turtle.reset();
  turtle.render(ast);
}

function setBus(bus) {
  bus.register("ControlLIce", e => {
    ast = e.detail.ast;
    redraw();
  });
}