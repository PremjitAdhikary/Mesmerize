let canvas;

let choice;

let ripple_reach;
let ripple_color;
let ripple_drag;
let ripple_frequency;
let ripple_random_counter = 0;

let fire_choice;
let fire_burner;
let burn_size;

let cloud_choice;

let effects;

const CHOICE_RIPPLE = 1;
const CHOICE_FIRE = 2;

function setup() {
  canvas = createCanvas(640, 480);
  canvas.parent('sketch-holder');

  updateEffect();

  pixelDensity(1);
}

function draw() {
  background(0);

  if (choice == CHOICE_RIPPLE && !ripple_drag) {
    ripple_random_counter++;
    if (ripple_random_counter >= ripple_frequency) {
      effects.ripple(random(2, width-3), random(2, height-3));
      ripple_random_counter = 0;
    }
  }
  effects.show();
}

function mouseDragged() {
  if (choice == CHOICE_RIPPLE && ripple_drag) {
    effects.ripple(mouseX, mouseY);
  }
}

function mouseClicked() {
  if (choice == CHOICE_FIRE && fire_burner) {
    effects.burn(mouseX, mouseY, burn_size);
  }
}

function updateEffect() {
  switch(choice) {
    case 1:
      setupRipples();
      break;
    case 2:
      setupFire();
      break;
    case 3:
      setupCould();
      break;
  }
}

function setupRipples() {
  simulateBackground();
  effects = new EffectsRipples(
    width, height, 
    SketchColor.blue(),
    calculateDamping());
  updateRippleColor();
  effects.setBaseColor();
}

function simulateBackground() {
  background(SketchColor.skyblue().stringify());
}

function calculateDamping() {
  return (ripple_reach + 69) / 100;
}

function updateRippleReach() {
  effects.setDamping(calculateDamping());
}

function updateRippleColor() {
  if (ripple_color) {
    effects.colorize();
  } else {
    effects.deColor();
  }
}

function setupFire() {
  effects = new EffectsFire(width, height);
  updateFire();
  updateFireStyle();
}

function updateFire() {
  effects.selectAndSetupFireVariables(fire_choice);
}

function updateFireStyle() {
  if (fire_burner) {
    effects.disableFireLine();
  } else {
    effects.enableFireLine();
  }
}

function setupCould() {
  switch(cloud_choice) {
    case 1:
      effects = new EffectsCloud(width, height, 5, 0.1, 0.1, 200, 150);
      effects.setColor(new SketchColor(150, 150, 150));
      effects.setGradient(SketchColor.white(), new SketchColor(150, 150, 150));
      break;
    case 2:
      effects = new EffectsCloud(width, height, 12, 0.12, 0.1, 250, 175);
      effects.setColor(new SketchColor(135, 182, 200));
      effects.setGradient(new SketchColor(187, 234, 252), new SketchColor(102, 213, 255));
      break;
    case 3:
      effects = new EffectsCloud(width, height, 8, 0.7, 0.12, 300, 125);
      effects.setColor(new SketchColor(237, 135, 40));
      effects.setGradient(new SketchColor(255, 214, 117), new SketchColor(255, 177, 82));
      break;
    case 4:
      effects = new EffectsCloud(width, height, 8, 0.08, 0.06, 120, 110);
      effects.setColor(new SketchColor(0, 33, 66));
      effects.setGradient(new SketchColor(74, 103, 133), new SketchColor(13, 59, 105));
      break;
  }
}

function setBus(bus) {
  bus.register("ControlSErC", e => {
    choice = e.detail.choice;
    updateEffect();
  });
  bus.register("ControlSErcT", e => {
    ripple_color = e.detail.ripple_color;
    updateRippleColor();
  });
  bus.register("ControlSErrr", e => {
    ripple_reach = e.detail.ripple_reach;
    updateRippleReach();
  });
  bus.register("ControlSErdT", e => {
    ripple_drag = e.detail.ripple_drag;
    ripple_random_counter = 0;
  });
  bus.register("ControlSErfr", e => {
    ripple_frequency = e.detail.ripple_frequency;
  });
  bus.register("ControlSEfcC", e => {
    fire_choice = e.detail.fire_choice;
    updateFire();
  });
  bus.register("ControlSEfbT", e => {
    fire_burner = e.detail.fire_burner;
    updateFireStyle();
  });
  bus.register("ControlSEbsr", e => {
    burn_size = e.detail.burn_size;
  });
  bus.register("ControlSEccC", e => {
    cloud_choice = e.detail.cloud_choice;
    setupCould();
  });
}

function setData(d) {
  choice = d.choice;
  ripple_reach = d.ripple_reach;
  ripple_color = d.ripple_color;
  ripple_drag = d.ripple_drag;
  ripple_frequency = d.ripple_frequency;
  fire_choice = d.fire_choice;
  fire_burner = d.fire_burner;
  burn_size = d.burn_size;
  cloud_choice = d.cloud_choice;
}