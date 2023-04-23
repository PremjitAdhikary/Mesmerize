import { SCREEN_WIDTH, SCREEN_HEIGHT, LEFT, RIGHT } from './constants.js';
import { checkForCollisions } from './collision-detection.js';
import { moveAliens, aliensAttack } from './alien-ai.js';

let screen = document.getElementById('game-area');

let longExplosionSound = new SoundPool("../diwali-special/audio/long-explosion.wav");
let shortExplosionSound = new SoundPool("../diwali-special/audio/short-explosion.wav");
let bulletSound = new SoundPool("./audio/bullet-sound-s.mp3", 80);
let blasterSound = new SoundPool("./audio/blaster-sound.mp3");

let setupDone = false;
let intervalId;

let screenLayout;
let gameObjects;
let aliens;
let player;

let move;
let attack;
let alienMoveDirection;

let wave;

function setup() {
  screenLayout = create2DArray(SCREEN_HEIGHT + 2, SCREEN_WIDTH + 2);
  screen.innerHTML = '';
  for (let r = 0; r < SCREEN_HEIGHT+2; r++) {
    let line = document.createElement('div');
    line.setAttribute('id', 'line_'+r);
    screen.appendChild(line);
    for (let c = 0; c < SCREEN_WIDTH+2; c++) {
      let cell = document.createElement('span');
      cell.setAttribute('id', 'cell_'+r+'_'+c);
      line.appendChild(cell);
    }
  }
  document.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') move = LEFT;
    else if (event.key === 'ArrowRight') move = RIGHT;
    if (event.key === 'x') attack = true;
  });
  document.addEventListener('keyup', event => {
    if (event.key === 'ArrowLeft' && move == LEFT) move = '';
    else if (event.key === 'ArrowRight' && move == RIGHT) move = '';
    if (event.key === 'x') attack = false;
  });
  setupDone = true;
}

function configureParameters() {
  move = '';
  wave = 0;
  alienMoveDirection = LEFT;
  attack = false;
  gameObjects = [];
  aliens = [];
}

function render() {
  if (!setupDone) return;
  clearScreen();
  processEvents();
  checkForCollisions(gameObjects);
  alienMoveDirection = moveAliens(aliens, alienMoveDirection, player);
  aliensOffense();
  updateScreen();
  renderScreen();
  clearGameObjects();
}

function clearScreen() {
  forEach2DArray(screenLayout, (elem, r, c) => screenLayout[r][c] = '&nbsp;');
}

function processEvents() {
  if (!player.active) return;
  if (move === LEFT) player.left();
  else if (move === RIGHT) player.right();
  if (attack) player.attack();
}

function aliensOffense() {
  if (!player.active) return;
  aliensAttack(aliens, player, wave);
}

function updateScreen() {
  gameObjects.forEach(obj => obj.animate());
  gameObjects.forEach(obj => obj.updateObjectOn());
}

function renderScreen() {
  forEach2DArray(screenLayout, (elem, r, c) => 
    document.getElementById('cell_'+r+'_'+c).innerHTML = screenLayout[r][c]);
}

function addGameObject(obj) {
  gameObjects.push(obj);
}

function clearGameObjects() {
  if (gameObjects.length < 150) return;
  gameObjects = gameObjects.filter(obj => obj.active);
}

function addPlayer(obj) {
  player = obj;
  addGameObject(obj);
}

function addAlien(obj) {
  aliens.push(obj);
  addGameObject(obj);
}

function aliensCount() {
  return aliens.filter(alien => alien.active).length;
}

function startGame() {
  configureParameters();
  if (intervalId) clearInterval(intervalId);
  intervalId = setInterval(render, 50);
}

function getWave() {
  return wave;
}

function incrementWave() {
  wave++;
}

function activateDualGuns() {
  player.dualGunsActivated = true;
}

function activateRapidFire() {
  player.rapidFireActivated = true;
}

function updateObjOnScreen(x, y, val) {
  if (x < 0 || x > SCREEN_WIDTH || y < 0 || y > SCREEN_HEIGHT) {console.log('kela');return;}
  screenLayout[y][x] = val;
}

setup();

export { addGameObject, addPlayer, addAlien, aliensCount, startGame, getWave, 
  incrementWave, activateDualGuns, activateRapidFire, updateObjOnScreen, 
  longExplosionSound, shortExplosionSound, bulletSound, blasterSound };