let canvas;

let debug = false;

let calculationSpeed;
let systems;
let cam;
let selectedSystem;
let selectedLorenz;
let lorenz = [
  {
    x: 1.1, y: 2, z: 7, o: 10, p: 28, B: 8.0 / 3.0, 
    hueInit: 0, hueInterval: 10, shapeVerticesInterval: 100, 
    maxPoints: 7200, scale: 6
  },
  {
    x: 20, y: 41, z: 20, o: 10, p: 14, B: 8.0 / 3.0, 
    hueInit: 120, hueInterval: 10, shapeVerticesInterval: 100, 
    maxPoints: 3600, scale: 5
  },
  {
    x: 0, y: 0.001, z: 0, o: 10, p: 13, B: 8.0 / 3.0, 
    hueInit: 150, hueInterval: 10, shapeVerticesInterval: 100, 
    maxPoints: 3600, scale: 13
  },
  {
    x: 0.01, y: 0, z: 0, o: 10, p: 15, B: 8.0 / 3.0, 
    hueInit: 0, hueInterval: 10, shapeVerticesInterval: 100, 
    maxPoints: 7200, scale: 11
  }
];

function setup() {
  canvas = createCanvas(640, 480, WEBGL);
  canvas.parent('sketch-holder');

  cam = createEasyCam();

  colorMode(HSB);

  init();
}

function init() {
  systems = [];
  switch(selectedSystem) {
    case 1:
      selectedLorenz = 0;
      setLorenz();
      break;
    case 2:
      selectedLorenz = 1;
      setLorenz();
      break;
    case 3:
      selectedLorenz = 2;
      setLorenz();
      break;
    case 4:
      selectedLorenz = 3;
      setLorenz();
      break;
    case 5:
      setLorenz84();
      break;
    case 6:
      setChen();
      break;
    case 7:
      setDadras();
      break;
    case 8:
      setThomas();
      break;
    case 9:
      setAizawa();
      break;
    case 10:
      setRossler();
      break;
    case 11:
      setHalvorsen();
      break;
    case 12:
      setRabinovichFabrikant();
      break;
    case 13:
      setThreeScrollUnifiedChaoticSystem();
      break;
    case 14:
      setSprott();
      break;
    case 15:
      setFourWing();
      break;
  }
}

function setLorenz() {
  const {x, y, z, o, p, B, hueInit, hueInterval, 
    shapeVerticesInterval, maxPoints, scale} 
    = lorenz[selectedLorenz];
  let system = new LorenzAttractor(
    x, y, z, o, p, B, 
    hueInit, hueInterval, shapeVerticesInterval, 
    maxPoints, calculationSpeed
  );
  system._scale = scale;
  systems.push(system);
}

function setLorenz84() {
  let system = new Lorenz84(-0.2, -2.82, 2.71, 
    160, 0, 1000, 
    6000, calculationSpeed);
  system._scale = 58;
  systems.push(system);
}

function setChen() {
  let system = new Chen(5, 10, 10, 
    70, 0, 4000, 
    4000, calculationSpeed);
  system._scale = 10;
  systems.push(system);
  let systemB = new Chen(-7, -5, -10, 
    170, 0, 4000, 
    4000, calculationSpeed);
  systemB._scale = 1;
  systems.push(systemB);
}

function setDadras() {
  let system = new Dadras(1.1, 2.1, -2, 
    70, 120, 1000,
    4000, calculationSpeed);
  system._scale = 17;
  systems.push(system);
}

function setThomas() {
  let system = new Thomas(1.1, 1.1, -0.01, 
    80, 0, 2500, 
    5000, calculationSpeed);
  system._scale = 45;
  systems.push(system);
}

function setAizawa() {
  let system = new Aizawa(0.1, 1, 0.01, 
    40, 0, 2500, 
    6000, calculationSpeed);
  system._scale = 110;
  systems.push(system);
}

function setRossler() {
  let system = new Rossler(10, 0, 10, 
    20, 0, 2500, 
    5000, calculationSpeed);
  system._scale = 10;
  systems.push(system);
}

function setHalvorsen() {
  let system = new Halvorsen(-1.48, -1.51, 2.04, 
    285, 0, 2500, 
    5000, calculationSpeed);
  system._scale = 17;
  systems.push(system);
}

function setRabinovichFabrikant() {
  let system = new RabinovichFabrikant(-1, 1, 0.5, 
    325, 0, 2000, 
    8000, calculationSpeed);
  system._scale = 90;
  systems.push(system);
}

function setThreeScrollUnifiedChaoticSystem() {
  let system = new ThreeScrollUnifiedChaoticSystem(-0.29, -0.25, -0.59, 
    275, 0, 500, 
    6500, calculationSpeed);
  system._scale = 1.2;
  systems.push(system);
}

function setSprott() {
  let system = new Sprott(0.63, 0.47, -0.54, 
    50, 0, 500, 
    4500, calculationSpeed);
  system._scale = 200;
  systems.push(system);
}

function setFourWing() {
  let system = new FourWing(1.3, -0.18, 0.01, 
    180, 0, 1000, 
    3500, calculationSpeed);
  system._scale = 100;
  systems.push(system);
}

function draw() {
  background(0);
  if (debug)
    drawAxes();
  for (let system of systems)
    system.draw();
}

function drawAxes() {
  let lineLen = 50;
  strokeWeight(1);
  stroke(0, 80, 70); // x - red
  line(0, 0, 0, lineLen, 0, 0);
  stroke(120, 80, 70); // y - green
  line(0, 0, 0, 0, lineLen, 0);
  stroke(0, 00, 100); // z - white
  line(0, 0, 0, 0, 0, lineLen);
}

function setBus(bus) {
  bus.register("ControlLScs", e => {
    selectedSystem = e.detail.selectedSystem;
    init();
  });
  bus.register("ControLSrcs", e => {
    calculationSpeed = e.detail.calculationSpeed;
    for (let system of systems) 
      system._maxPointsToCalculate = calculationSpeed;
  });
}

function setData(d) {
  selectedSystem = d.selectedSystem,
  calculationSpeed = d.calculationSpeed
}