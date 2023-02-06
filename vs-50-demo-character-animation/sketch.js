let canvas;

let characters_radio;
let hero_moves_radio;
let normal_moves_radio;

let groundColor;
let ramAnim;
let vanaraAnim;
let jambuvanAnim;
let valiAnim;
let cAnim;

let infoBGColor;
let infoColor;

let ramSprite;
let ramJSON;
let vanaraSprite;
let vanaraJSON;
let jambuvanSprite;
let jambuvanJSON;
let valiSprite;
let valiJSON;

let debug = false;

function preload() {
  ramSprite = loadImage('./img/sprites/RamSpriteSheet.png')
  ramJSON = loadJSON('./animation-data/ram.json');
  vanaraSprite = loadImage('./img/sprites/VanaraSpriteSheet.png')
  vanaraJSON = loadJSON('./animation-data/vanara.json');
  jambuvanSprite = loadImage('./img/sprites/JambuvanSpriteSheet.png')
  jambuvanJSON = loadJSON('./animation-data/jambuvan.json');
  valiSprite = loadImage('./img/sprites/ValiSpriteSheet.png')
  valiJSON = loadJSON('./animation-data/vali.json');
}

function setup() {
  canvas = createCanvas(640, 480);
  canvas.parent('sketch-holder');
  groundColor = 
    SketchColor.blend(SketchColor.grey(), SketchColor.grey(), SketchColor.white()).stringify();
  ramAnim = new CharacterAnimator('ram', ramSprite, ramJSON);
  ramAnim.loadAnimationData(() => console.log('loaded ram'));
  vanaraAnim = new CharacterAnimator('vanara', vanaraSprite, vanaraJSON);
  vanaraAnim.loadAnimationData(() => console.log('loaded vanara'));
  jambuvanAnim = new CharacterAnimator('jambuvan', jambuvanSprite, jambuvanJSON);
  jambuvanAnim.loadAnimationData(() => console.log('loaded jambuvan'));
  valiAnim = new CharacterAnimator('vali', valiSprite, valiJSON);
  valiAnim.loadAnimationData(() => console.log('loaded vali'));
  infoBGColor = SketchColor.black().alpha50().stringify();
  infoColor = SketchColor.white().stringify();

  setDebugForAnimation();
}

function draw() {
  if (!cAnim) {
    updateAnimSprite();
  }
  background(185);
  stroke(groundColor);
  fill(groundColor);
  rect(0, 400, width, height - 400);
  cAnim.animate();
  cAnim.show(320, 370);
  info();
}

function updateAnimSprite() {
  switch(characters_radio) {
    case 1: 
      cAnim = ramAnim;
      break;
    case 2: 
      cAnim = vanaraAnim;
      break;
    case 3: 
      cAnim = jambuvanAnim;
      break;
    case 4: 
      cAnim = valiAnim;
      break;
  }
}

function debugOn() {
  debug = true;
  setDebugForAnimation();
}

function debugOff() {
  debug = false;
  setDebugForAnimation();
}

function setDebugForAnimation() {
  ramAnim.showCollisionBox = debug;
  vanaraAnim.showCollisionBox = debug;
  jambuvanAnim.showCollisionBox = debug;
  valiAnim.showCollisionBox = debug;
}

function setBus(bus) {
  bus.register("ControlV50DCAcr", e => {
    characters_radio = e.detail.characters_radio;
    updateAnimSprite();
  });
  bus.register("ControlV50DCAhmr", e => {
    hero_moves_radio = e.detail.hero_moves_radio;
  });
  bus.register("ControlV50DCAnmr", e => {
    normal_moves_radio = e.detail.normal_moves_radio;
  });
  bus.register("ControlV50DCAlstartb", e => {
    cAnim.set(getMove(), true);
  });
  bus.register("ControlV50DCAlstopb", e => {
    cAnim.resetToDefault();
  });
  bus.register("ControlV50DCAab", e => {
    cAnim.set(getMove(), false);
  });
}

function getMove() {
  let heroMoves = ['forward', 'back', 'action1', 'action2', 'hit', 'die'];
  let normalMoves = ['forward', 'action1', 'action2', 'hit', 'die'];
  if (characters_radio == 1) {
    return heroMoves[hero_moves_radio-1];
  } else {
    return normalMoves[normal_moves_radio-1];
  }
}

function info() {
  noStroke();
  strokeWeight(1);
  fill(infoBGColor);
  rect(5, 5, 110, 22);
  stroke(infoColor);
  fill(infoColor);
  text('FrameRate: '+frameRate().toFixed(2), 10, 20);
}

function setData(d) {
  characters_radio = d.characters_radio;
  hero_moves_radio = d.hero_moves_radio;
  normal_moves_radio = d.normal_moves_radio;
}