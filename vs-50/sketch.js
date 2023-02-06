let canvas;

let manager;
let fontSamarkan;
let gameFont;

let eventBus;

let actionsIconSprite;
let interfaceImg;

// story art
let gameMenuImg;
let kishKindhaImg;
let lordRamImg;
let valiImg;
let armyImg;
let gamePlayImg;

let ramSprite;
let ramSpriteColored;
let ramJSON;
let vanaraSprite;
let vanaraSpriteColored;
let vanaraJSON;
let jambuvanSprite;
let jambuvanSpriteColored;
let jambuvanJSON;
let valiSprite;
let valiSpriteColored;
let valiJSON;

let debug = false;

function preload() {
  fontSamarkan = loadFont('./font/Samarkan.ttf');
  gameFont = fontSamarkan;
  actionsIconSprite = loadImage('./img/sprites/actionsSpriteSheet.png');
  interfaceImg = loadImage('./img/interface.jpg');
  gameMenuImg = loadImage('./img/art/GameMenu.jpg');
  kishKindhaImg = loadImage('./img/art/KishKindha.jpg');
  valiImg = loadImage('./img/art/Vali.jpg');
  armyImg = loadImage('./img/art/VanaraNJambuvan.jpg');
  lordRamImg = loadImage('./img/art/LordRam.jpg');
  gamePlayImg = loadImage('./img/art/GamePlay.jpg');
  ramSprite = loadImage('../vs-50-demo-character-animation/img/sprites/RamSpriteSheet.png');
  ramSpriteColored = loadImage('./img/sprites/RamSpriteSheetColored.png');
  ramJSON = loadJSON('../vs-50-demo-character-animation/animation-data/ram.json');
  vanaraSprite = loadImage('../vs-50-demo-character-animation/img/sprites/VanaraSpriteSheet.png');
  vanaraSpriteColored = loadImage('./img/sprites/VanaraSpriteSheetColored.png');
  vanaraJSON = loadJSON('../vs-50-demo-character-animation/animation-data/vanara.json');
  jambuvanSprite = loadImage('../vs-50-demo-character-animation/img/sprites/JambuvanSpriteSheet.png');
  jambuvanSpriteColored = loadImage('./img/sprites/JambuvanSpriteSheetColored.png');
  jambuvanJSON = loadJSON('../vs-50-demo-character-animation/animation-data/jambuvan.json');
  valiSprite = loadImage('../vs-50-demo-character-animation/img/sprites/ValiSpriteSheet.png');
  valiSpriteColored = loadImage('./img/sprites/ValiSpriteSheetColored.png');
  valiJSON = loadJSON('../vs-50-demo-character-animation/animation-data/vali.json');
}

function setup() {
  canvas = createCanvas(1128, 480);
  canvas.parent('sketch-holder');
  manager = new SceneManager();
  manager.showScene(GameMenu);
  // disable context menu on right click
  window.addEventListener('contextmenu', function (e) { 
    e.preventDefault(); 
  }, false);
}

function draw() {
  manager.draw();
}

function mouseClicked(event) {
  if (mouseInCanvas())
    manager.handleEvent("mouseClicked", event);
}

function mousePressed(event) {
  if (mouseInCanvas())
    manager.handleEvent("mousePressed", event);
}

function mouseReleased(event) {
  if (mouseInCanvas())
    manager.handleEvent("mouseReleased", event);
}

function doubleClicked() {
  if (mouseInCanvas())
    manager.handleEvent("doubleClicked");
}

function keyPressed() {
  if (keyCode === BACKSPACE) {
    saveCanvas(canvas, 'lala', 'jpg');
  }
  manager.handleEvent("keyPressed");
}

function setBus(bus) {
  eventBus = new GameEventBus(bus);
}