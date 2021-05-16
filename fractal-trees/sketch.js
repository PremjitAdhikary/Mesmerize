let canvas;
let tree;

let choice;

let baseWidth = 6;

let binaryBase = 125;
let binaryLevel;
let binaryAngle;
let binarySeedAngle;
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

let pythagoran_angle;
let pythagoran_level;
let pythagoran_line_art;

let phyllotaxis_angle;
let phyllotaxis_level;
let phyllotaxis_gap;

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
        binaryColor, binaryBranchColor, baseWidth, binaryLevel,
        map(binarySeedAngle,-180,180,-PI,PI));
    case 2:
      return new RandomBranch(
        createVector(width/2, height), 
        createVector(width/2, height - randomBase),
        map(randomAngle,0,180,0,randomAngle*PI/180), 
        randomColor, randomBranchColor, baseWidth, randomLevel, randomMaxBranches);
    case 3:
      return new AllSystems(lsystem_generations, lsystem_choice);
    case 4:
      return new PythagoranBase((width/2)-(width*0.058), height-50, (width/2)+(width*0.058), 
        height-50, radians(pythagoran_angle), pythagoran_level, pythagoran_line_art);
    case 5:
      return new Phyllotaxis(phyllotaxis_angle, phyllotaxis_level, phyllotaxis_gap, 2048);
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
  bus.register("ControlLFTrbsa", e => {
    if (choice === 1) {
      binarySeedAngle = e.detail.bin_seed_angle;
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
  bus.register("ControlLFTpta", e => {
    if (choice === 4) {
      pythagoran_angle = e.detail.pythagoran_angle;
      redraw();
    }
  });
  bus.register("ControlLFTptl", e => {
    if (choice === 4) {
      pythagoran_level = e.detail.pythagoran_level;
      redraw();
    }
  });
  bus.register("ControlLFTptta", e => {
    pythagoran_line_art = e.detail.pythagoran_line_art;
    redraw();
  });
  bus.register("ControlLFTptc", e => {
    if (choice === 5) {
      phyllotaxis_angle = e.detail.phyllotaxis_angle;
      redraw();
    }
  });
  bus.register("ControlLFTptpl", e => {
    if (choice === 5) {
      phyllotaxis_level = e.detail.phyllotaxis_level;
      redraw();
    }
  });
  bus.register("ControlLFTptpg", e => {
    if (choice === 5) {
      phyllotaxis_gap = e.detail.phyllotaxis_gap;
      redraw();
    }
  });
}

function setData(d) {
  choice = d.choice;
  binaryAngle = d.bin_angle;
  binarySeedAngle = d.bin_seed_angle;
  binaryLevel = d.bin_level;
  randomAngle = d.random_angle;
  randomMaxBranches = d.random_branches;
  lsystem_choice = d.lsystem_choice;
  lsystem_generations = d.lsystem_generations;
  pythagoran_angle = d.pythagoran_angle;
  pythagoran_level = d.pythagoran_level;
  pythagoran_line_art = d.pythagoran_line_art;
  phyllotaxis_angle = d.phyllotaxis_angle;
  phyllotaxis_level = d.phyllotaxis_level;
  phyllotaxis_gap = d.phyllotaxis_gap;
}