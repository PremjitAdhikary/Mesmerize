let canvas;
let tree;

let choice;

let baseWidth = 6;

let binaryBase = 125;
let binaryLevel;
let binaryAngle;
let binaryColor;
let binaryBranchColor;

let randomBase = 130;
let randomLevel = 9;
let randomAngle;
let randomMaxBranches;
let randomColor;
let randomBranchColor;

let lsystem_choice;
let lsystem_generations;

function setup() {
  canvas = createCanvas(640, 480);
  canvas.parent('sketch-holder');
  binaryColor = SketchColor.yellow().stringify();

  randomColor = SketchColor.greenyellow().stringify();
  randomBranchColor = SketchColor.blend(
    SketchColor.yellow(), SketchColor.orange(), SketchColor.grey())
    .stringify();
  noLoop();
}

function draw() {
  background(0);
  tree = createTree();
  tree.show();
}

function createTree() {
  switch(choice) {
    case 1:
      return new Branch(
        createVector(width/2, height), 
        createVector(width/2, height - binaryBase),
        map(binaryAngle,0,180,0,PI), 
        binaryColor, binaryBranchColor, baseWidth, binaryLevel);
    case 2:
      return new RandomBranch(
        createVector(width/2, height), 
        createVector(width/2, height - randomBase),
        map(randomAngle,0,180,0,randomAngle*PI/180), 
        randomColor, randomBranchColor, baseWidth, randomLevel, randomMaxBranches);
    case 3:
      return new AllSystems(lsystem_generations, lsystem_choice);
  }
}

function setBus(bus) {
  bus.register("ControlLFTrC", e => {
    choice = e.detail.choice;
    redraw();
  });
  bus.register("ControlLFTrba", e => {
    if (choice === 1) {
      binaryAngle = e.detail.bin_angle;
      redraw();
    }
  });
  bus.register("ControlLFTrbl", e => {
    if (choice === 1) {
      binaryLevel = e.detail.bin_level;
      redraw();
    }
  });
  bus.register("ControlLFTrra", e => {
    if (choice === 2) {
      randomAngle = e.detail.random_angle;
      redraw();
    }
  });
  bus.register("ControlLFTrrb", e => {
    if (choice === 2) {
      randomMaxBranches = e.detail.random_branches;
      redraw();
    }
  });
  bus.register("ControlLFTlsc", e => {
    if (choice === 3) {
      lsystem_choice = e.detail.lsystem_choice;
      redraw();
    }
  });
  bus.register("ControlLFTlsg", e => {
    if (choice === 3) {
      lsystem_generations = e.detail.lsystem_generations;
      redraw();
    }
  });
  bus.register("ControlLFTrrd", e => {
    redraw();
  });
}

function setData(d) {
  choice = d.choice;
  binaryAngle = d.bin_angle;
  binaryLevel = d.bin_level;
  randomAngle = d.random_angle;
  randomMaxBranches = d.random_branches;
  lsystem_choice = d.lsystem_choice;
  lsystem_generations = d.lsystem_generations;
}

function keyTyped() {
  saveCanvas(canvas, 'myCanvas', 'jpg');
}