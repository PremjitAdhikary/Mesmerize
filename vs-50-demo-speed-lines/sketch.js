let canvas;

let groundColor;
let effectObjs;

let choice_effect;
let speed;

let teleportLineStartWidth;
let teleportLineEndWidth;
let teleportLineTotalFrames;

let trailSpeed;
let trailFlyBeats;
let trailLineTotalFrames;
let trailProjectiles;

let trailArcTotalFrames;

let sweepArcSpeed;
let sweepArcTotalFrames;

let originX = 0;

let infoColor;
let infoBGColor;

let standingChar;
let rightChar;
let leftChar;

function setup() {
  canvas = createCanvas(640, 480);
  canvas.parent('sketch-holder');
  groundColor = 
    SketchColor.blend(SketchColor.grey(), SketchColor.grey(), SketchColor.white()).stringify();
  effectObjs = [];
  trailProjectiles = [];
  setupCharacter();
  infoBGColor = SketchColor.black().alpha50().stringify();
  infoColor = SketchColor.white().stringify();
}

function draw() {
  background(185);
  stroke(groundColor);
  fill(groundColor);
  rect(0, 400, width, height - 400);
  effectObjs.forEach( o => o.render(originX) );
  if (choice_effect == 2) {
    trailProjectiles.forEach(tp => tp.update());
    if (trailProjectiles.length > 10)
      trailProjectiles = trailProjectiles.filter( tp => !tp.trail.removeObj );
  }
  if (effectObjs.length > 10)
    effectObjs = effectObjs.filter( e => !e.removeObj );
  originX += speed;
  drawCharacter();
  info();
}

function setupCharacter() {
  standingChar = [
    createVector(width/2 - 5, 430), createVector(width/2 - 5, 380), 
    createVector(width/2 + 5, 380), createVector(width/2 + 5, 430)
  ];
  rightChar = [
    createVector(width/2 - 5, 430), createVector(width/2 + 15, 380), 
    createVector(width/2 + 15, 400)
  ];
  leftChar = [
    createVector(width/2 + 5, 430), createVector(width/2 - 15, 380), 
    createVector(width/2 - 15, 400)
  ];
}

function drawCharacter() {
  noStroke();
  fill(0);
  beginShape();
  let vertices = speed == 0 ? standingChar : speed > 0 ? rightChar : leftChar;
  for (let v of vertices) vertex(v.x, v.y);
  endShape();
}

function initTeleportLine() {
  let y = random(410, 380);
  effectObjs.push(new TeleportLine({
    start: createVector(originX + width/2, y), 
    end: createVector(originX + mouseX, y), z: 3, 
    startWidth: teleportLineStartWidth, endWidth: teleportLineEndWidth, 
    totalFrames: teleportLineTotalFrames
  }));
}

function initTrailLine() {
  let trail = new TrailLine({
    start: createVector(originX + width/2, random(410, 380)), z: 3, 
    totalFrames: trailLineTotalFrames
  });
  effectObjs.push(trail);
  let speedMult = (width/2 > mouseX) ? -1 : 1;
  trailProjectiles.push(new ProjectileDummy(trail, trailSpeed * speedMult, trailFlyBeats));
}

function initTrailArc() {
  let arc = new TrailArc({
    start: createVector(originX + width/2, random(410, 380)), z: 3, 
    totalFrames: trailArcTotalFrames, 
    strokeWeight: 15, 
    strokeCap: PROJECT, 
    arcToAdd: [60, 40, 10, 10, 10], 
    arcDirection: (width/2 < mouseX) ? TrailArc.ANTICLOCKWISE : TrailArc.CLOCKWISE, 
    center: createVector(originX + width/2, height/2 + 100)
  });
  effectObjs.push(arc);
}

function initSweepArc() {
  let rConfig = {
    center: createVector(originX + width/2, random(410, 380)), z: 2, 
    totalFrames: sweepArcTotalFrames, 
    strokeWeight: 25, 
    speed: sweepArcSpeed, 
    w: width/4, h: 30, startA: -20, stopA: 0
  };
  let lConfig = {
    center: createVector(originX + width/2, random(410, 380)), z: 2, 
    totalFrames: sweepArcTotalFrames, 
    strokeWeight: 25, 
    speed: sweepArcSpeed, 
    w: width/4, h: 30, startA: 180, stopA: 200
  };
  let arc = new SweepArc((width/2 < mouseX) ? rConfig : lConfig);
  effectObjs.push(arc);
}

function mousePressed() {
  if (!mouseInCanvas()) return;
  let initFuncs = [initTeleportLine, initTrailLine, initTrailArc, initSweepArc];
  initFuncs[choice_effect-1]();
}

function info() {
  noStroke();
  strokeWeight(1);
  fill(infoBGColor);
  rect(5, 5, 110, 22);
  stroke(infoColor);
  fill(infoColor);
  text('FrameRate: '+frameRate().toFixed(2), 10, 20);
}

function setBus(bus) {
  bus.register("ControlV50DSPce", e => {
    choice_effect = e.detail.choice_effect;
  });
  bus.register("ControlV50DSPtcs", e => {
    speed = e.detail.speed;
  });

  bus.register("ControlV50DSPtcsw", e => {
    teleportLineStartWidth = e.detail.teleportLineStartWidth;
  });
  bus.register("ControlV50DSPtcew", e => {
    teleportLineEndWidth = e.detail.teleportLineEndWidth;
  });
  bus.register("ControlV50DSPtctf", e => {
    teleportLineTotalFrames = e.detail.teleportLineTotalFrames;
  });
  
  bus.register("ControlV50DSPtls", e => {
    trailSpeed = e.detail.trailSpeed;
  });
  bus.register("ControlV50DSPtld", e => {
    trailFlyBeats = e.detail.trailFlyBeats;
  });
  bus.register("ControlV50DSPtltf", e => {
    trailLineTotalFrames = e.detail.trailLineTotalFrames;
  });
  bus.register("ControlV50DSPtatf", e => {
    trailArcTotalFrames = e.detail.trailArcTotalFrames;
  });
  bus.register("ControlV50DSPsas", e => {
    sweepArcSpeed = e.detail.sweepSpeed;
  });
  bus.register("ControlV50DSPsatf", e => {
    sweepArcTotalFrames = e.detail.sweepArcTotalFrames;
  });
}

function setData(d) {
  choice_effect = d.choice_effect;
  speed = d.speed;
  teleportLineStartWidth = d.teleportLineStartWidth;
  teleportLineEndWidth = d.teleportLineEndWidth;
  teleportLineTotalFrames = d.teleportLineTotalFrames;
  trailSpeed = d.trailSpeed;
  trailFlyBeats = d.trailFlyBeats;
  trailLineTotalFrames = d.trailLineTotalFrames;
  trailArcTotalFrames = d.trailArcTotalFrames;
  sweepArcSpeed = d.sweepSpeed;
  sweepArcTotalFrames = d.sweepArcTotalFrames;
}

class ProjectileDummy {
  constructor(trail, speed, beats) {
    this.trail = trail;
    this.startPoint = this.trail.config.start;
    this.speed = speed;
    this.beats = beats;
    this.currBeat = 0;
  }
  update() {
    if (this.currBeat >= this.beats) return;
    this.currBeat++;
    this.trail.addToPath(
      createVector(this.startPoint.x + (this.speed * this.currBeat), this.startPoint.y));
    if (this.currBeat >= this.beats) this.trail.fade();
  }
}