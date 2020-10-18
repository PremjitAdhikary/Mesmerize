let canvas;

let choice_creature;
let creature_count;

let creatures;
let targetLocations;

function setup() {
  canvas = createCanvas(640, 480);
  canvas.parent('sketch-holder');
  initCreatures();
}

function initCreatures() {
  creatures = [];
  targetLocations = [];
  for (let i=0; i<creature_count; i++) {
    creatures.push(getACreature(choice_creature));
    targetLocations.push(randomTarget());
  }
}

function getACreature(selected) {
  let arr = [glider, winger, slither, walker];
  switch (selected) {
    case 1: return basic();
    case 2: return glider();
    case 3: return winger();
    case 4: return slither();
    case 5: return walker();
    default: return random(arr)();
  }
}

let basic = function() {
  return createCreature(2, 4, 20, 30, len => new AxisRenderer(len));
}

let glider = function() {
  return createCreature(1, 2, 15, 20, len => new GlideRenderer(len));
}

let winger = function() {
  return createCreature(1, 3, 20, 25, len => new WingedRenderer(len));
}

let slither = function() {
  return createCreature(0.5, 1, 20, 25, len => new SlitherRenderer(len));
}

let walker = function() {
  return createCreature(1.5, 2, 20, 25, len => new LimbedRenderer(len));
}

function createCreature(minSpeed, maxSpeed, minLength, maxLength, renderer) {
  let mover = new Mover(randomTarget());
  mover.setTopSpeed(random(minSpeed, maxSpeed));
  let len = Math.floor(random(minLength, maxLength));
  let creature = new BasicCreature(mover, renderer(len));
  return creature;
}

function draw() {
  background(225);
  let mInC = mouseInCanvas();
  for (let i=0; i<creature_count; i++) {
    creatures[i].moveTo(mInC ? createVector(mouseX, mouseY) : targetLocations[i]);
    creatures[i].render();
    if (creatures[i].onLocation(targetLocations[i])) {
      targetLocations[i] = randomTarget();
    }
  }
}

function randomTarget() {
  let margin = 50;
  return createVector(
    margin + Math.floor(random(width-(margin*2))), 
    margin + Math.floor(random(height-(margin*2))));
}

function setBus(bus) {
  bus.register("ControlCcc", e => {
    choice_creature = e.detail.choice_creature;
    initCreatures();
  });
  bus.register("ControCcs", e => {
    creature_count = e.detail.creature_count;
    initCreatures();
  });
}

function setData(d) {
  choice_creature = d.choice_creature;
  creature_count = d.creature_count;
}