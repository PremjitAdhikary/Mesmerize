let canvas;

let stars;

function setup() {
  canvas = createCanvas(640, 480);
  canvas.parent('sketch-holder');
  stars = [];
  for (let i=0; i<500; i++) stars[i] = new Star();
}

function draw() {
  background(0);
  translate(width/2,height/2);
  stars.forEach(s => {
    s.show();
    s.update();
  });
}

function mouseClicked() {
  if (mouseInCanvas()) {
    stars.forEach(s => s.toggleWarp());
  }
}

function keyTyped() {
  saveCanvas(canvas, 'myCanvas', 'jpg');
}