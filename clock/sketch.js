let canvas;

let choice;
let clock;

function setup() {
  canvas = createCanvas(640, 480);
  canvas.parent('sketch-holder');
  frameRate(30);
  init();
}

function draw() {
  background(0);
  angleMode(DEGREES);
  clock.show();
}

function init() {
  switch(choice) {
    case 1: clock = new BarClock(); break;
    case 2: clock = new JustAClock(); break;
    case 3: clock = new ArcClock(); break;
    case 4: clock = new MaedasClock(); break;
    case 5: clock = new DigitalClock(); break;
    case 6: clock = new MaedasClockPendulum(); break;
  }
}

function setBus(bus) {
  bus.register("ControlCc", e => {
    choice = e.detail.choice;
    init();
  });
}

function setData(d) {
  choice = d.choice;
}