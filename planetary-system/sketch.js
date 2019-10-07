let sun;

function setup() {
  canvas = createCanvas(640, 480);
  canvas.parent('sketch-holder');
  init();
}

function draw() {
  background(0);
  translate(width/2, height/2);
  sun.show();
}

function mouseClicked() {
  if (mouseInCanvas()) {
    init();
  }
}

function init() {
  sun = new CelestialBody(0, 50, 
          SketchColor.blend(SketchColor.yellow(), SketchColor.white()).stringify(), 
          CelestialBody.calculateAngularVelocity(0));
  sun.spawnSatellites(5, 1);
  addRingedCelestial();
}

// chance to add a saturn? 50%
function addRingedCelestial() {
  if (random(-1,1) > 0) {
    sun.addSatellite(new RingedCelestial(330, 8, 
        SketchColor.blend(SketchColor.yellow(),SketchColor.grey(),SketchColor.white()).stringify(), 
        sun._angleVelocity));
  }
}