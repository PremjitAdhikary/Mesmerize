let canvas;

let choice_dla;
let brownianTree;

function setup() {
  canvas = createCanvas(640, 480);
  canvas.parent('sketch-holder');
  init();
}

function init() {
  switch(choice_dla) {
    case 1: 
      brownianTree = new BrownianTree(BASIC_DLA);
      break;
    case 2: 
      brownianTree = new BrownianTree(LINE_DLA);
      break;
    case 3: 
      brownianTree = new BrownianTree(BOX_DLA);
      break;
    case 4: 
      brownianTree = new BrownianTree(CIRCLE_SEED_DLA);
      break;
    case 5: 
      brownianTree = new BrownianSnowflake(SNOWFLAKE_VARIANT_1);
      break;
    case 6: 
      brownianTree = new BrownianSnowflake(SNOWFLAKE_VARIANT_2);
      break;
  }
}

function draw() {
  background(0);

  brownianTree.show();
  brownianTree.grow();
  brownianTree.moveParticles();
}

function setBus(bus) {
  bus.register("ControlDlaCdla", e => {
    choice_dla = e.detail.choice_dla;
    init();
  });
}

function setData(d) {
  choice_dla = d.choice_dla;
}