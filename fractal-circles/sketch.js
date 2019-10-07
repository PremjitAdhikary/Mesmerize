const MONO = 1;
const BI = 2;
const QUAD = 4;

let canvas;
let radius;
let grow;
let style = MONO;

let colorArr;

function setup() {
  canvas = createCanvas(640, 480);
  canvas.parent('sketch-holder');
  frameRate(24);
  colorArr = [
    SketchColor.blend(SketchColor.violet(), SketchColor.white()).stringify(),
    SketchColor.blend(SketchColor.blue(), SketchColor.white()).stringify(),
    SketchColor.blend(SketchColor.green(), SketchColor.white()).stringify(),
    SketchColor.blend(SketchColor.yellow(), SketchColor.white()).stringify(),
    SketchColor.blend(SketchColor.orange(), SketchColor.white()).stringify(),
    SketchColor.blend(SketchColor.red(), SketchColor.white()).stringify() 
  ];
  init();
}

function init() {
  radius = 2;
  grow = true;
}

function draw() {
  background(0);
  translate(width/2, height/2);
  drawFractal(0, 0, radius, 0);
  
  if (grow && radius < height/2) {
    radius = radius * 1.02;
  } else if (!grow && radius > 2) {
    radius = radius * 0.98;
  } else if ((grow && radius >= height/2) ||  (!grow && radius <= 2)) {
    grow = !grow;
  }
}

function drawFractal(x, y, r, level) {
  drawCircle(x, y, r, level);
  recursiveCall(x, y, r, level);
}

function drawCircle(x, y, r, level) {
  stroke(colorArr[level % colorArr.length]);
  strokeWeight(1);
  noFill();
  circle(x, y, r*2);
}

function recursiveCall(x, y, r, level) {
  if (style === MONO && r > 4) {
    drawFractal(x, y, r * 0.75, level+1);
    return;
  }
  
  if (style === BI && r > 4) {
    drawFractal(x + r, y, r * 0.5, level+1);
    drawFractal(x - r, y, r * 0.5, level+1);
    return;
  }
  
  if (style === QUAD && r > 8) {
    drawFractal(x + r, y, r * 0.5, level+1);
    drawFractal(x - r, y, r * 0.5, level+1);
    drawFractal(x, y + r, r * 0.5, level+1);
    drawFractal(x, y - r, r * 0.5, level+1);
    return;
  }
}

function mouseClicked() {
  if (mouseInCanvas()) {
    switch (style) {
      case MONO: 
        style = BI;
        break;
      case BI: 
        style = QUAD;
        break;
      case QUAD: 
        style = MONO;
        break;
    }
    init();
  }
}

function keyTyped() {
  saveCanvas(canvas, 'myCanvas', 'jpg');
}