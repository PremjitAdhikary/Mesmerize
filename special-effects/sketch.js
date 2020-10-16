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
  effects = new EffectsFire(
    width, height);
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
}