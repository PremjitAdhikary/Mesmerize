let canvas;
let bgBuffer;
let bgBuffer2;

let algorithm;
let target;
let start;
let obstacles;

let choice_env;
let choice_algo;
let bee_speed;

// ge algorithm specific numbers
let lifespan;
let populationSize;
let subPopulations;
let mutation_chance;
let elitism_limit;

let greenyellow;
let greenyellowTransparent;
let violet;
let orange;
let skyblue;

let envs = [
  {
    population: 50,
    life: 100,
    start: {x: 320, y: 440},
    target: {x: 320, y: 80},
    obstacles: [ ], 
    subPopulations: 1
  }, 
  {
    population: 100,
    life: 150,
    start: {x: 320, y: 440},
    target: {x: 320, y: 80},
    obstacles: [
      { x: 320, y: 240, w: 320, h: 30 }
    ], 
    subPopulations: 2
  }, 
  {
    population: 100,
    life: 200,
    start: {x: 320, y: 440},
    target: {x: 320, y: 80},
    obstacles: [
      { x: 192, y: 192, w: 320, h: 30 }, 
      { x: 444, y: 288, w: 320, h: 30 }
    ], 
    subPopulations: 2
  }, 
  {
    population: 100,
    life: 150,
    start: {x: 320, y: 440},
    target: {x: 320, y: 80},
    obstacles: [
      { x: 160, y: 240, w: 128, h: 30 },
      { x: 480, y: 240, w: 128, h: 30 },
      { x: 320, y: 160, w: 128, h: 30 }
    ], 
    subPopulations: 2
  }, 
  {
    population: 200,
    life: 250,
    start: {x: 40, y: 240},
    target: {x: 600, y: 240},
    obstacles: [
      { x: 160, y: 160, w: 30, h: 256 },
      { x: 320, y: 320, w: 30, h: 256 },
      { x: 480, y: 160, w: 30, h: 256 }
    ], 
    subPopulations: 4
  }, 
  {
    population: 200,
    life: 400,
    start: {x: 40, y: 240},
    target: {x: 600, y: 240},
    obstacles: [
      { x: 160, y: 96, w: 30, h: 384 }, 
      { x: 160, y: 425, w: 30, h: 128 }, 
      { x: 320, y: 55, w: 30, h: 128 }, 
      { x: 320, y: 380, w: 30, h: 384 }, 
      { x: 480, y: 96, w: 30, h: 384 }, 
      { x: 480, y: 425, w: 30, h: 128 }
    ], 
    subPopulations: 4
  }
];

function setup() {
  canvas = createCanvas(640, 480);
  canvas.parent('sketch-holder');
  greenyellow = SketchColor.greenyellow().stringify();
  greenyellowTransparent = SketchColor.greenyellow().alpha(0.3).stringify();
  violet = (new SketchColor(130, 46, 255)).stringify();
  orange = (new SketchColor(255, 130, 46)).stringify();
  skyblue = (new SketchColor(46, 171, 255)).stringify();

  bgBuffer = createGraphics(640, 480);
  bgBuffer2 = createGraphics(640, 480);
  buildEnvironment(choice_env);
}

function initiate() {
  switch(choice_algo) {
    case 1:
      algorithm = new GeneticAlgorithm(start, target, obstacles, populationSize, lifespan);
      break;
    case 2:
      algorithm = new ParallelGeneticAlgorithm(start, target, obstacles, populationSize, lifespan, subPopulations);
      break;
  }
  algorithm.configureRun({
    speed: bee_speed, 
    mutation: mutation_chance,
    elitism: elitism_limit,
    runGenerations: false, 
    callbackAfterGenRun: () => {}
  });
}

function buildEnvironment(envIndex) {
  let e = envs[envIndex];
  populationSize = e.population;
  subPopulations = e.subPopulations;
  lifespan = e.life;
  start = new Start(e.start.x, e.start.y);
  target = new Target(e.target.x, e.target.y);
  obstacles = [];
  e.obstacles.forEach(o => obstacles.push(new Obstacle(o.x, o.y, o.w, o.h)));
}

function draw() {
  background(0);
  runAlgo();
  render();
}

function render() {
  if (algorithm) algorithm.preRender();
  obstacles.forEach(o => o.render());
  start.render();
  target.render();
  if (algorithm) algorithm.render();
  if (algorithm) algorithm.postRender();
}

function runAlgo() {
  if (algorithm)
    algorithm.run();
}

function runGenerations(genCount, call_back) {
  algorithm.configureRun({
    speed: bee_speed, 
    mutation: mutation_chance, 
    elitism: elitism_limit, 
    runGenerations: genCount, 
    callbackAfterGenRun: call_back
  });
}

function setBus(bus) {
  bus.register("ControlSBce", e => {
    choice_env = e.detail.choice_env;
    buildEnvironment(choice_env);
  });
  bus.register("ControlSBra", e => {
    initiate();
  });
  bus.register("ControlSBca", e => {
    choice_algo = e.detail.choice_algo;
  });
  bus.register("ControlSBsa", e => {
    algorithm = null;
  });
  bus.register("ControlSBmc", e => {
    mutation_chance = e.detail.mutation_chance;
    algorithm.configureRun({
      speed: bee_speed, 
      mutation: mutation_chance, 
      elitism: elitism_limit, 
      runGenerations: false, 
      callbackAfterGenRun: () => {}
    });
  });
  bus.register("ControlSBel", e => {
    elitism_limit = e.detail.elitism_limit;
    algorithm.configureRun({
      speed: bee_speed, 
      mutation: mutation_chance, 
      elitism: elitism_limit, 
      runGenerations: false, 
      callbackAfterGenRun: () => {}
    });
  });
  bus.register("ControlSBbSpeed", e => {
    bee_speed = e.detail.bee_speed;
    algorithm.configureRun({
      speed: bee_speed, 
      mutation: mutation_chance, 
      elitism: elitism_limit, 
      runGenerations: false, 
      callbackAfterGenRun: () => {}
    });
  });
  bus.register("ControlSBg10", e => {
    runGenerations(10, e.detail.call_back);
  });
  bus.register("ControlSBg50", e => {
    runGenerations(50, e.detail.call_back);
  });
}

function setData(d) {
  choice_env = d.choice_env;
  choice_algo = d.choice_algo;
  bee_speed = d.bee_speed;
  mutation_chance = d.mutation_chance;
  elitism_limit = d.elitism_limit;
}