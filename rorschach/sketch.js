let canvas;

let bg;

let a = 100;
let b = 80;
let z = -100;
let xMult = 0.01;
let yMult = 0.01;
let zMult = 0.08;
let zRange = { min: -10, max: 10 };
let pixelWeight = 4;
let faceBounds;

let drops;

function preload(){
  bg = loadImage('img/rorschach.png');
}

function setup() {
  canvas = createCanvas(640, 480);
  canvas.parent('sketch-holder');
  faceBounds = [];
  calculateFaceBounds();
  populateRaindrops();
}

function draw() {
  background(255);
  strokeWeight(1);
  renderFace();
  image(bg, 0, 0);
  z += 0.05;
  renderRain();
}

/**
 * Uses perline noise to render rorschach animation in the face bounded by range calculated 
 * in calculateFaceBounds().
 */
function renderFace() {
  push();
  translate(width/2, 180);
  rotate(PI/2.5);

  for (let x=-a; x<=a; x+=pixelWeight) {
    for (let y=0; y<=faceBounds[x]; y+=pixelWeight) {
      let zVal = map(noise(x*xMult, y*yMult, z*zMult), 0, 1, zRange.min, zRange.max);
      let c = getColor(zVal);
      stroke(c);
      strokeWeight(1);
      fill(c);
      square(x, y, pixelWeight);
      square(x, -y, pixelWeight);
    }
  }

  pop();
}

/**
 * Range which bounds the face of the character.
 * Idea is to change the equation of a oval a little.
 * Equation of oval:
 *      2       2
 * (x/a)  + (y/b)  = 1, where a = major axis and b is minor axis
 * 
 * Based on equation found here:
 * http://www.mathematische-basteleien.de/eggcurves.htm
 */
function calculateFaceBounds() {
  for (let x=-a; x<=a; x++) {
    let tx = 1 / (1-0.005*x);
    let y = Math.sqrt( (1 - Math.pow(x,2)/Math.pow(a,2))*Math.pow(b,2)/tx );
    faceBounds[x] = y;
  }
}

function populateRaindrops() {
  drops = [];
  for (let i=0; i<25; i++) {
    drops.push(new RainDrop(50+(i*30), random(-100,-600), 100, 3));
    drops.push(new RainDrop(40+(i*30), random(-100,-700), 150, 2));
    drops.push(new RainDrop(30+(i*30), random(-100,-800), 200, 1));
  }
}

function getColor(val) {
  if (val > 0.15) return 255;
  if (val < -0.15) return 0;
  else return 100;
}

function renderRain() {
  push();
  rotate(PI/8);
  drops.forEach(drop => {
    drop.fall();
    drop.render();
  });
  pop();
}

class RainDrop {

  constructor(x,y,len,wid) {
    this._x = x;
    this._startY = y;
    this._y = y;
    this._len = random(len-10, len+10);
    this._wid = wid;
    this._fallSpeed = random(8, 12);
    this._currFallSpeed = this._fallSpeed;
  }

  fall() {
    this._y += this._currFallSpeed;
    this._currFallSpeed += 0.1;
    if (this._y > (height+100-this._startY)) {
      this._y = this._startY;
      this._currFallSpeed = this._fallSpeed;
    }
  }

  render() {
    stroke(255);
    strokeWeight(this._wid);
    line(this._x, this._y, this._x, this._y-this._len);
  }
}