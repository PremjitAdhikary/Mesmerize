let canvas;

let choice;
let forward_base_angle;
let forward_child_angle;
let forward_segments;
let inverse_length;
let inverse_segments;
let inverse_anchored;

let totalLengthOfTentacle;
let tentacle;

let ball;

function setup() {
  canvas = createCanvas(640, 480);
  canvas.parent('sketch-holder');
  totalLengthOfTentacle = height * 0.65;
  initSketch();
  setBall();
}

function draw() {
  background(0);
  if (choice === 1) {
    if (tentacle) {
      tentacle.render();
      ball.render();
      if (ball.touched(tentacle.topPosition())) {
        setBall();
      }
    }
  } else {
    if (mouseInCanvas()) {
      tentacle.follow(createVector(mouseX, mouseY));
    }
    tentacle.render();
  }
}

function initSketch() {
  if (choice === 1) {
    tentacle = new ForwardTentacle(
      totalLengthOfTentacle, 
      forward_segments, 
      radians(-90+forward_base_angle), 
      radians(forward_child_angle));
  } else {
    tentacle = new InverseTentacle(
      map(inverse_length, 1, 10, height*0.4, height*0.9), 
      inverse_segments, 
      inverse_anchored);
  }
}

function setBall() {
  let dist = random(height * 0.2, height * 0.55);
  let angle = radians(-90+random(-80, 80));
  let dx = dist * cos(angle);
  let dy = dist * sin(angle);
  ball = new TouchMeNotBall(createVector(width/2 + dx, height + dy), 15);
}

function setBus(bus) {
  bus.register("ControlKcr", e => {
    choice = e.detail.choice;
    initSketch();
  });
  bus.register("ControlKsfba", e => {
    forward_base_angle = e.detail.forward_base_angle;
    tentacle.setBaseAngle(radians(-90+forward_base_angle));
  });
  bus.register("ControlKsfca", e => {
    forward_child_angle = e.detail.forward_child_angle;
    tentacle.setSegmentAngle(radians(forward_child_angle));
  });
  bus.register("ControlKsfs", e => {
    forward_segments = e.detail.forward_segments;
    initSketch();
  });
  bus.register("ControlKsil", e => {
    inverse_length = e.detail.inverse_length;
    initSketch();
  });
  bus.register("ControlKsis", e => {
    inverse_segments = e.detail.inverse_segments;
    initSketch();
  });
  bus.register("ControlKabis", e => {
    inverse_anchored = e.detail.inverse_anchored;
    tentacle.setAnchor(inverse_anchored);
  });
}

function setData(d) {
  choice = d.choice;
  forward_base_angle = d.forward_base_angle;
  forward_child_angle = d.forward_child_angle;
  forward_segments = d.forward_segments;
  inverse_segments = d.inverse_segments;
  inverse_length = d.inverse_length;
  inverse_anchored = d.inverse_anchored;
}