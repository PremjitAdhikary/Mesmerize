let canvas;

let zoom;
let zoomMultiplier;
let zoomMultipliers = [30,20,15,12,
   10, 9, 8, 7, 6, 5, 4, 3, 2, 1.5, 1,
  0.9,0.8,0.7,0.6,0.5,0.4,0.3,0.2,0.15,0.1,
  0.09,0.08,0.07,0.06,0.05,0.04,0.03,0.02,0.015,0.01,
  0.009,0.008,0.007,0.006,0.005,0.004,0.003,0.002,0.0015,0.001
];
let textTillZoom = 9;
let TEXT_SIZE = 8;
let primes = [];

function setup() {
  canvas = createCanvas(640, 480);
  canvas.parent('sketch-holder');
  noLoop();
  generatePrime();
}

function generatePrime() {
  primes.push(2);
  let p = 3;
  primes.push(p);
  while (p < (width*1000)) {
    p+=2;
    let isComposite = false;
    let loop = primes.length;
    for (let i=1; i<loop; i++) {
      let a = primes[i];
      if (a*a > p) break;
      if (p % a == 0) {
        isComposite = true;
        break;
      }
    }
    if (!isComposite) primes.push(p);
  }
}

function draw() {
  background(0);
  stroke(SketchColor.yellow().alpha50().stringify());
  strokeWeight(1);
  line(width/2,0,width/2,height);
  line(0,height/2,width,height/2);
  translate(width/2, height/2);
  strokeWeight(calculateStrokeWeight());
  stroke(SketchColor.greenyellow().stringify());
  textSize(TEXT_SIZE);
  fill(SketchColor.greenyellow().stringify());
  calculateZoomMultiplier();
  primes.forEach(p => drawVectorPoint(p));
}

function drawVectorPoint(p) {
  let v = p5.Vector.fromAngle(-p,p);
  v.mult(zoomMultiplier);
  if (v.x > -width/2 && v.x < width/2 && v.y > -height/2 && v.y < height/2) {
    if (zoom <= textTillZoom) {
      text(p, v.x-TEXT_SIZE/2, v.y);
    } else {
      point(v.x, v.y);
    }
  }
}

function setBus(bus) {
  bus.register("ControlPSz", e => {
    zoom = e.detail.zoom;
    redraw();
  });
}

function setData(d) {
  zoom = d.zoom;
}

function calculateZoomMultiplier() {
  zoomMultiplier = zoomMultipliers[zoom-1];
}

function calculateStrokeWeight() {
  return zoom <= textTillZoom ? 1 : map(zoom, 1,46, 4, 1);
}