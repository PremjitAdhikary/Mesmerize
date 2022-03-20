let canvas;

let WATER_COLOR;
let FISH_COLOR;
let TURTLE_COLOR;
let env;
let turtles;
let fishes;
let gradientAngle = 0;

function setup() {
  canvas = createCanvas(640, 480);
  canvas.parent('sketch-holder');
  WATER_COLOR = (new SketchColor(108,203,229)).stringify();
  FISH_COLOR = 235;
  TURTLE_COLOR = (SketchColor.green()).stringify();
  initEnv();
  initCreatures();
}

function initEnv() {
  env = new BasicEnv();

  env.addUnreachableRectangle(-50,-50,690,50);
  env.addUnreachableRectangle(-50,430,690,530);
  env.addUnreachableRectangle(-50,-50,50,530);
  env.addUnreachableRectangle(590,-50,690,530);

  env.addWall([
    createVector(50,50), createVector(590,50), createVector(590,430), 
    createVector(50,430), createVector(50,50)
  ]);
}

function initCreatures() {
  addTurtles();
  fishes = [];
  let flocking = getFlockingStrategy();
  addFishes(flocking);
}

function getContainmentStrategy() {
  let containmentStrategy = new Containment([env]);
  let wanderStrategy = new Wander();
  let separationStrategy = new Separation(turtles, 60);

  let strategy = new ComboStrategy();
  strategy.addStrategy(containmentStrategy, 'contain', 2)
    .addStrategy(wanderStrategy, 'wander', 1)
    .addStrategy(separationStrategy, 3);
  strategy.lookAhead = ahead => {
    containmentStrategy.lookAhead(ahead);
    wanderStrategy.wanderDistance(ahead);
  };
  strategy.lookAhead(100);
  return strategy;
}

function getFlockingStrategy() {
  let separationStrategy = new Separation(fishes, 30);
  let obstacleAvoidStrategy = new ObstacleAvoidance(turtles);
  obstacleAvoidStrategy.lookAhead(50);
  let alignStrategy = new Alignment(fishes, 40);
  let cohesionStrategy = new Cohesion(fishes, 50);

  let strategy = new ComboStrategy();
  strategy.addStrategy(separationStrategy, 'separate', 1)
    .addStrategy(obstacleAvoidStrategy, 'avoid', 5.0)
    .addStrategy(alignStrategy, 'align', 0.75)
    .addStrategy(cohesionStrategy, 'cohesion', 0.75);
  return strategy;
}

function addTurtles() {
  turtles = [];
  for (let t = 0; t < 2; t++) {
    let containment = getContainmentStrategy();
    let turtle = new AquariumTurtle(random(150, width - 150), random(150, height - 150));
    turtle.addStrategy(containment);
    turtles.push(turtle);
  }
}

function addFishes(strategy, 
    startX = 0, endX = width, startY = 0, endY = height) {
  for (let f = 0; f < 50; f++) {
    let fish = new AquariumFish(random(startX, endX), random(startY, endY));
    fish.addStrategy(strategy);
    fishes.push(fish);
    fish.resetVelocity();
  }
}

function draw() {
  drawBackground();
  rectMode(CORNER);
  fishes.forEach(f => actUpdateAndShow(f));
  turtles.forEach(t => actUpdateAndShow(t));
}

function actUpdateAndShow(creature) {
  creature.act();
  creature.update();
  creature.show();
}

function drawBackground() {
  background(WATER_COLOR);
  setGradient(0, 0, width, height, color(108,203,229), color(108,163,219));
}

function setGradient(x, y, w, h, c1, c2) {
  noFill();
  for (let i = y; i <= y + h; i++) {
    let inter = map(i, y, y + h, sin(gradientAngle), cos(gradientAngle));
    let c = lerpColor(c1, c2, inter);
    stroke(c);
    line(x, i, x + w, i);
  }
  gradientAngle += 0.03;
}