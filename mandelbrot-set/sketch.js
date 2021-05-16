let canvas;

let mandelbrot;
let zoombrot;
let julia;

let borderColor;

let pointX = 300;
let pointY = 140;

function setup() {
  canvas = createCanvas(640, 480);
  canvas.parent('sketch-holder');

  pixelDensity(1);

  borderColor = SketchColor.gold().stringify();

  mandelbrot = new Mandelbrot(0, 0, width, height, -2.1, 2.1, 120);
  zoombrot = new Mandelbrot(406, 20, width / 3, height / 3, -0.0525, 0.0525, 200);
  julia = new Julia(406, 300, width / 3, height / 3, -2.1, 2.1, 100);

  noLoop();
}

function draw() {
  background(180);
  mandelbrot.show();
  zoombrot._xOffset = map(pointX, 0, 640, -4300, 4300);
  zoombrot._yOffset = map(pointY, 0, 480, -3240, 3240);
  zoombrot.show();
  julia._xOffset = pointX;
  julia._yOffset = pointY;
  julia.show();

  stroke(borderColor);
  strokeWeight(1);
  noFill();
  rect(pointX - 10, pointY - 7.5, 20, 15);
  strokeWeight(2);
  rect(406, 20, width / 3, height / 3);
  rect(406, 300, width / 3, height / 3);
}

function mouseClicked() {
  if (!mouseInCanvas()) 
    return;
  pointX = mouseX;
  pointY = mouseY;
  redraw();
}