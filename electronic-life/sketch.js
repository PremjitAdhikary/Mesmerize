let canvas;

let choice_world;

let envChoice;
let selectedEnvironment;
let electronicEnvironment;
let world;
let choice_worm;
let choice_fish;
let choice_pollinators;

let show_info;
let maxFrameRate;

function preload() {
  configData = loadJSON('./env-plan.json');
}

function setup() {
  canvas = createCanvas(640, 480);
  canvas.parent('sketch-holder');
  pixelDensity(1);

  init();
}

function draw() {
  background(0);
  drawEnv();
  if (show_info) {
    drawGrid();
    drawFrameRate();
    world.showInfo();
  }
}

function init() {
  generateEnv();
  populateWorld();
  maxFrameRate = 0;
  initStats();
}

function reset() {
  generateEnv();
  populateWorld();
  maxFrameRate = 0;
  resetStats();
}

function generateEnv() {
  switch(choice_world) {
    case 1:
      envChoice = "moving";
      break;
    case 2:
      envChoice = "living";
      break;
    case 3:
      envChoice = "symbotic";
      break;
  }
  selectedEnvironment = random(configData.env.filter(e => e.type == envChoice));
  electronicEnvironment = new ElectronicEnvironment(selectedEnvironment);
}

function populateWorld() {
  world = new World(electronicEnvironment, getStaticBuilders());
  switch(envChoice) {
    case "moving":
      populateMovingWorld();
      break;
    case "living":
      populateLivingWorld();
      break;
    case "symbotic":
      populateSymbioticWorld();
      break;
  }
}

function populateMovingWorld() {
  world._electronicEnvironment.setDamping(0.7);
  // put flies on land
  let landTileCondition = (r, c) => world._data[r][c].length == 1;
  populateActors(landTileCondition, flyBuilder, random(8, 15));

  // put turtles on shallow water
  let shallowWaterTileCondition = (r, c) => 
    world._data[r][c].length == 0 
    && world._electronicEnvironment._envData[r][c] == ElectronicEnvironment.WATER_EDGE;
  populateActors(shallowWaterTileCondition, turtleBuilder, random(5, 9));
}

function populateLivingWorld() {
  world._electronicEnvironment.setDamping(0.45);
  // put lilys on water
  let waterTileCondition = (r, c) => world._data[r][c].length == 0;
  populateActors(waterTileCondition, lilyBuilder, random(20, 25));

  // put worms on water
  let wormBuilder = choice_worm == 1 ? greedyWormBuilder : smartWormBuilder;
  populateActors(waterTileCondition, wormBuilder, random(4, 6));

  // put fishes in water
  if (choice_fish != 1) {
    let fishBuilder = choice_fish == 2 ? greedyFishBuilder : smartFishBuilder;
    populateActors(waterTileCondition, fishBuilder, random(1,2));
  }
}

function populateSymbioticWorld() {
  world._electronicEnvironment.setDamping(0.65);
  
  // put lilys on water
  let waterTileCondition = (r, c) => world._data[r][c].length == 0;
  populateActors(waterTileCondition, pollinatingLilyBuilder, random(20, 25));

  // put pollinators and queen
  let possibleLocations = findPossibleHiveLocations();
  for (let h=0; h<choice_pollinators; h++) {
    let hiveLoc = random(possibleLocations);
    let hive = new Hive(world, hiveLoc.x, hiveLoc.y);
    hive._maxPollinatorsInHive = choice_pollinators == 1 ? 8 : 16;

    hive.addQueen(queenBuilder(world, 0, 0));
    let pMax = choice_pollinators == 1 ? random(2,4) : random(6,8);
    for (let p=0; p<pMax; p++) {
      hive.addPollinator(pollinatorFlyBuilder(world, 0, 0));
    }
    let index = possibleLocations.indexOf(hiveLoc);
    possibleLocations.splice(index, 1);
  }
}

function findPossibleHiveLocations() {
  let possibleLocations = [];
  for (let r=1; r<world._data.length-1; r++)
    for (let c=1; c<world._data[0].length-1; c++) 
      if (Hive.checkIfLocationSuitable(world, r, c)) 
        possibleLocations.push(createVector(r,c));
  return possibleLocations;
}

function getStaticBuilders() {
  let builders = {};
  builders[ElectronicEnvironment.LAND_CHAR] = landBuilder;
  return builders;
}

function populateActors(condition, actorBuilder, actorCount) {
  let a = 0;
  while ( a < actorCount) {
    let r = Math.floor(random(0, world._data.length));
    let c = Math.floor(random(0, world._data[0].length));
    if (condition(r, c)) {
      actorBuilder(world, r, c);
      a++;
    }
  }
}

function drawGrid() {
  stroke(SketchColor.white().alpha(0.3).stringify());
  strokeWeight(1);

  let gap = selectedEnvironment.size;
  for (let y=0; y<=height; y+=gap) 
    line(0, y, width, y);
  for (let x=0; x<=width; x+=gap) 
    line(x, 0, x, height);
}

function drawFrameRate() {
  let rate = Math.floor(frameRate());
  maxFrameRate = Math.max(maxFrameRate, rate);
  noStroke();
  fill(SketchColor.white().alpha75().stringify());
  rect(15, 15, 250, 30, 5);
  fill(0);
  textSize(15);
  text('FPS: '+rate+' [max:'+maxFrameRate+']', 10, 20);
}

function drawEnv() {
  world.show();
}

function mouseClicked() {
  if (show_info && mouseInCanvas()) {
    world.enableShow(mouseX, mouseY);
  }
}

function setBus(bus) {
  bus.register("ControlELcwr", e => {
    choice_world = e.detail.choice_world;
  });
  bus.register("ControlELsiT", e => {
    show_info = e.detail.show_info;
  });
  bus.register("ControlELl", e => {
    reset();
  });
  bus.register("ControlELcw", e => {
    choice_worm = e.detail.choice_worm;
  });
  bus.register("ControlELcf", e => {
    choice_fish = e.detail.choice_fish;
  });
  bus.register("ControlELcp", e => {
    choice_pollinators = e.detail.choice_pollinators;
  });
}

function setData(d) {
  choice_world = d.choice_world;
  show_info = d.show_info;
  choice_worm = d.choice_worm;
  choice_fish = d.choice_fish;
  choice_pollinators = d.choice_pollinators;
}