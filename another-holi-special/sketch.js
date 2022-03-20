let canvas;

let envBack;
let envMid;
let envFront;
let sprite;

let graphicObjs;

let addVehicles;
let removeGraphics;

let ped;
let balloon;

function preload() {
  envBack = loadImage('./img/artwork/outside.jpg');
  envMid = loadImage('./img/artwork/mid-ground.png');
  envFront = loadImage('./img/artwork/fore-ground.png');
  sprite = loadImage('./img/artwork/sprite.png');
  addVehicles = intervalCaller(() => 250, () => {
    graphicObjs.push(Vehicle.GET_ONE());
    return true;
  });
  addPlay = intervalCaller(() => 700, () => {
    ped = Pedestrian.GET_ONE();
    graphicObjs.push(ped);
    balloon = Balloon.GET_ONE(ped);
    graphicObjs.push(balloon);
    return true;
  });
  removeGraphics = intervalCaller(() => 1000, 
    () => {
      graphicObjs = graphicObjs.filter(go => !go.toRemove);
      return true;
    });
}

function setup() {
  canvas = createCanvas(640, 480);
  canvas.parent('sketch-holder');
  graphicObjs = [];
  graphicObjs.push(new GraphicObj(envBack, 0, 0, -10));
  graphicObjs.push(new GraphicObj(envFront, 0, 0, 10));
  graphicObjs.push(new KpBobble(sprite, 580, 380, 11));
  graphicObjs.push(new GraphicObj(envMid, 0, 0, 0));
}

function draw() {
  removeGraphics();
  addVehicles();
  addPlay();
  background(0);
  graphicObjs.forEach(go => go.animate());
  graphicObjs.sort( (a,b) => a.z > b.z ? 1 : b.z > a.z ? -1 : 0 );
  graphicObjs.forEach(go => go.show());
}

function mousePressed() {
  balloon.throw();
}