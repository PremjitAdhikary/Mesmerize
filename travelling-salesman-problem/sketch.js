let canvas;

let choice_algo;
let number_of_cities;

let bestColor;
let bestRoute;
let testColor;
let testRoute;
let cities;
let distances;

let tspParam;
let tspAlgo;

function setup() {
  canvas = createCanvas(640, 480);
  canvas.parent('sketch-holder');

  bestColor = SketchColor.blend(SketchColor.violet(), SketchColor.white());
  testColor = SketchColor.skyblue();
  initCities();
  initAlgo();
}

function initCities() {
  let margin = 20;
  let range = width/2 - margin*2;
  cities = [];
  for (let i=0; i<number_of_cities; i++) {
    cities.push(createVector(random(range) + margin, random(range + 50) + margin));
  }
  distances = create2DArray(number_of_cities, number_of_cities);
  forEach2DArray(distances, (cell, r, c) => {
    if (r == c) {
      distances[r][c] = Number.MAX_VALUE;
    } else {
      distances[r][c] = dist(cities[r].x, cities[r].y, cities[c].x, cities[c].y);
    }
  });
  bestRoute = [];
  testRoute = [];
}

function initAlgo() {
  tspParam = {
    cities,
    distances,
    bestRoute: [],
    testRoute: [],
    messages: [],
    testRouteMessage: '',
    bestRouteMessage: ''
  };
  switch(choice_algo) {
    case 1: 
      tspAlgo = new BruteForce(tspParam);
      break;
    case 2: 
      tspAlgo = new HeldKarp(tspParam);
      break;
    case 3: 
      tspAlgo = new NearestNeighbor(tspParam, true, 1);
      break;
    case 4: 
      tspAlgo = new RepetitiveNearestNeighbor(tspParam);
      break;
    case 5: 
      tspAlgo = new CheapestLink(tspParam);
      break;
    case 6: 
      tspAlgo = new GeneticAlgorithm(tspParam);
      break;
  }
}

function draw() {
  background(0);
  tspAlgo.run();
  drawEverything(bestColor, tspParam.bestRoute, tspParam.bestRouteMessage);
  push();
  translate(width/2, 0);
  drawEverything(testColor, tspParam.testRoute, tspParam.testRouteMessage);
  pop();
  showMessage();
}

function drawEverything(cityColor, path, message) {
  drawCities(cityColor);
  drawPaths(cityColor, path, message);
}

function drawCities(cityColor) {
  stroke(cityColor.stringify());
  fill(cityColor.stringify());
  strokeWeight(1);
  for (let city of cities) {
    circle(city.x, city.y, 6);
    noFill();
  }
}

function drawPaths(pathColor, path, message) {
  for (let edge of path) 
    edge.draw(pathColor, 1);
  textSize(10);
  strokeWeight(1);
  text(message, 5, 15);
}

function showMessage() {
  stroke(SketchColor.greenyellow().stringify());
  strokeWeight(1);
  if (tspParam.messages.length == 0) return;
  let textY = 400;
  tspParam.messages.forEach( message => {
    let tWidth = textWidth(message);
    textSize(10);
    text(message, (width - tWidth)/2, textY);
    textY += 15;
  } );
}

function setBus(bus) {
  bus.register("ControlTSPca", e => {
    choice_algo = e.detail.choice_algo;
    initAlgo();
  });
  bus.register("ControlTSPr", e => {
    initCities();
    initAlgo();
  });
  bus.register("ControlTSPrnoc", e => {
    number_of_cities = e.detail.number_of_cities;
  });
}

function setData(d) {
  choice_algo = d.choice_algo;
  number_of_cities = d.number_of_cities;
}