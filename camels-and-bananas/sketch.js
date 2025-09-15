let canvas;

let choice_algo;
let choice_route_len;

let theRoute;
let routeLength;
let camel;
let bananas;
let milestoneDiam = 40;
let routeStart;
let algorithm;

let grassColor;
let roadColor;
let woodColor;
let camelColor;

function setup() {
  canvas = createCanvas(640, 480);
  canvas.parent('sketch-holder');
  grassColor = SketchColor.blend(SketchColor.greenyellow(), SketchColor.grey(), SketchColor.grey(), SketchColor.grey()).stringify();
  roadColor = SketchColor.blend(SketchColor.yellow(), SketchColor.orange(), SketchColor.grey()).stringify();
  woodColor = (new SketchColor(102, 57, 0)).stringify();
  camelColor = (new SketchColor(193, 154, 107)).stringify();
  frameRate(4);
  init();
}

function init() {
  routeLength = (choice_route_len == 1 ? 10 : 100);
  routeStart = new Milestone(29, 24, 0, true);
  routeStart.bananas = routeLength*3;
  theRoute = [];
  let milestoneCount = 0;
  let directionRight = true;
  let x = 87;
  let y = 24;
  for (let i=0; i<10; i++) {
    for (let j=0; j<10; j++) {
      let stone = new Milestone(x, y, milestoneCount+1, directionRight);
      theRoute.push(stone);
      x += (58 * (directionRight ? 1 : -1));
      milestoneCount++;
      if (milestoneCount >= routeLength) break;
    }
    if (milestoneCount >= routeLength) break;
    x += (58 * (directionRight ? -1 : 1));
    directionRight = !directionRight;
    y += 48;
  }
  camel = new Camel(-1, routeLength);
  algorithm = (choice_algo == 1 ? new BackAndForthAlgorithm(camel) : new IntermediateDropPoints(camel));
}

function draw() {
  background(grassColor);
  drawPath(routeStart, theRoute[0]);
  for (let i=1; i<routeLength; i++) drawPath(theRoute[i-1], theRoute[i]);
  routeStart.draw();
  theRoute.forEach(stone => stone.draw());
  camel.draw();
  algorithm.run();
}

function drawPath(stoneA, stoneB) {
  stroke(roadColor);
  strokeWeight(10);
  line(stoneA.x, stoneA.y + milestoneDiam/2, stoneB.x, stoneB.y + milestoneDiam/2);
}

function setBus(bus) {
  bus.register("ControlCnBca", e => {
    choice_algo = e.detail.choice_algo;
    init();
  });
  bus.register("ControlCnBcrl", e => {
    choice_route_len = e.detail.choice_route_len;
    init();
  });
}

function setData(d) {
  choice_algo = d.choice_algo;
  choice_route_len = d.choice_route_len;
}