let canvas;

let lsystems;
let system;
let animate;
let showInstructions;

function setup() {
  canvas = createCanvas(640, 480);
  canvas.parent('sketch-holder');

  animate = true;
  showInstructions = false;

  frameRate(2);

  lsystems = new LSystems();
  loadSystem();
}

function loadSystem() {
  lsystems.loadSystem(system);
}

function draw() {
  background(0);
  lsystems.render();
  if (showInstructions)
    drawInstructions();
  if (animate)
    update();
}

function update() {
  lsystems.nextGeneration();
}

function drawInstructions() {
  noStroke();
  fill(SketchColor.black().alpha(0.5).stringify());
  rect(1, 1, 215, 65);
  textSize(10);
  fill(255);
  text('Key Controls:', 5, 15);
  text('T: Toggle between animate / still modes', 10, 30);
  text('R: Resets to Generation 0', 10, 45);
  text('Space: Render Next Generation in Still Mode', 10, 60);

  fill(SketchColor.black().alpha(0.5).stringify());
  rect(2, 450, 636, 20);
  fill(255);
  if (lsystems._currentString.length > 100)
    text(('String length: ' + lsystems._currentString.length), 2, 462);
  else 
    text(('String: ' + lsystems._currentString), 2, 462);
}

function keyPressed() {
  switch(keyCode) {
    case 82: // R
      lsystems.resetVariables();
      break;
    case 32: // Space
      if (!animate) 
        update();
      break;
    case 84: // T
      animate = !animate;
      break;
  }
}

function mouseClicked() {
  if (mouseInCanvas()) 
    showInstructions = !showInstructions;
}

function setBus(bus) {
  bus.register("ControlLSlbb", e => {
    system = e.detail.system;
    loadSystem();
  });
}

function setData(d) {
  system = d.system;
}