let canvas;
let terrainType; // mesh, land, sea
let flyOver;
let terrainGenerator;
let terrainWidth;
let terrainHeight;

// terrain variables
let meshNorth = {
  noStroke: false,
  unitSize: 20,
  rowOffsetIncrement: 0.2,
  colOffsetIncrement: 0.1,
  zLow: -100,
  zHigh: 120,
  flyDirection: 'north',
  flySpeed: 0.1
};

let meshEast = {
  noStroke: false,
  unitSize: 20,
  rowOffsetIncrement: 0.2,
  colOffsetIncrement: 0.1,
  zLow: -80,
  zHigh: 100,
  flyDirection: 'east',
  flySpeed: 0.05
};

let landNorth = {
  noStroke: false,
  unitSize: 20,
  rowOffsetIncrement: 0.1,
  colOffsetIncrement: 0.1,
  zLow: -180,
  zHigh: 250,
  flyDirection: 'north',
  flySpeed: 0.08
};

let landEast = {
  noStroke: false,
  unitSize: 25,
  rowOffsetIncrement: 0.1,
  colOffsetIncrement: 0.1,
  zLow: -160,
  zHigh: 220,
  flyDirection: 'east',
  flySpeed: 0.04
};

let seaNorth = {
  noStroke: true,
  unitSize: 30,
  rowOffsetIncrement: 0.2,
  colOffsetIncrement: 0.1,
  zLow: -40,
  zHigh: 60,
  flyDirection: 'north',
  flySpeed: 0.01
};

let seaEast = {
  noStroke: true,
  unitSize: 30,
  rowOffsetIncrement: 0.2,
  colOffsetIncrement: 0.1,
  zLow: -30,
  zHigh: 50,
  flyDirection: 'east',
  flySpeed: 0.01
};



function setup() {
  canvas = createCanvas(640, 480, WEBGL);
  canvas.parent('sketch-holder');
  setupTerrainVariables();
  setupTerrainGenerator();
}

function setupTerrainVariables() {
  terrainWidth = 1100;
  terrainHeight = 700;
  let landUnitColor = new SketchColor(124, 252, 0);
  let landStrokeColor = SketchColor.blend(SketchColor.grey(), landUnitColor);
  landNorth.strokeColor = landStrokeColor;
  landNorth.unitColor = landUnitColor;
  landEast.strokeColor = landStrokeColor;
  landEast.unitColor = landUnitColor;

  let seaUnitColor = new SketchColor(0, 167, 190);
  seaNorth.unitColor = seaUnitColor;
  seaEast.unitColor = seaUnitColor;
}

function setupTerrainGenerator() {
  let generateTerrain;
  switch(terrainType) {
    case 'mesh': 
      generateTerrain = flyOver ? meshNorth : meshEast;
      break;
    case 'land':
      generateTerrain = flyOver ? landNorth : landEast;
      break;
    case 'sea':
      generateTerrain = flyOver ? seaNorth : seaEast;
      break;
  }

  terrainGenerator = new TerrainGenerator(terrainWidth, terrainHeight, generateTerrain);
}

function draw() {
  drawBackground();
  setOrientation();
  terrainGenerator.updateTerrainVariables();
  terrainGenerator.render();
}

function drawBackground() {
  switch(terrainType) {
    case 'mesh': 
      background(150);
      break;
    case 'land':
      background(135, 206, 235);
      break;
    case 'sea':
      background(0);
      setGradient(-terrainWidth/2-100, -terrainHeight/2-100, terrainWidth+200, 300, 
        color(255, 140, 0), color(135, 206, 235));
      break;
  }
}

function setGradient(x, y, w, h, c1, c2) {
  noFill();
  let z = -350;
  for (let i = y; i <= y + h; i++) {
    let inter = map(i, y, y + h, 0, 1);
    let c = lerpColor(c1, c2, inter);
    stroke(c);
    line(x, i, z, x + w, i, z);
  }
}

function setOrientation() {
  rotateX(PI/3);
  translate(-terrainWidth/2, -terrainHeight/2);
}

function setBus(bus) {
  bus.register("ControlTct", e => {
    terrainType = e.detail.choice_terrain;
    setupTerrainGenerator();
  });
  bus.register("ControlTcd", e => {
    flyOver = e.detail.choice_direction === 'over';
    setupTerrainGenerator();
  });
}

function setData(d) {
  terrainType = d.choice_terrain;
  flyOver = d.choice_direction === 'over';
}