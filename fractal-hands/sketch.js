let canvas;

let size = 10;

let hand;
let anchorOffset = 0;

let color;

let r=0;
let rOff = 1;

function setup() {
  canvas = createCanvas(640, 480);
  canvas.parent('sketch-holder');
  color = SketchColor.gold().stringify();
  hand = new Hand(width/2, height+size, size,-PI/2, color);
}

function draw() {
  drawBG();
  hand.show();
  hand.update();
  let limit = height*0.09;
  let len = hand.height();
  if (hand.height() > limit) {
    hand.updateAnchor(width/2, height+size+anchorOffset+(hand.height()-limit));
  }

  calculateAnchorOffset(len);
  if (len > 13000) {
    anchorOffset = 0;
    hand = new Hand(width/2, height+size, size,-PI/2, color);
  }
}

function drawBG() {
  background(r, r+50, 120-r);
  r += rOff;
  if (r >= 100 || r <= 0) rOff = -rOff;
}

function calculateAnchorOffset(len) {
  if (len >= 300 && len < 400) {
    anchorOffset = map(len, 300, 400, 0.1, 1.0);
  }
  if (len >= 400) {
    anchorOffset += 1;
  }
  if (len >= 1200 && len < 1500) {
    anchorOffset += map(len, 1200, 1500, 0.1, 2.0);
  }
  if (len > 1500) {
    anchorOffset += 2;
  }
}