import { addPlayer, addAlien, aliensCount, startGame, getWave, incrementWave, 
  activateDualGuns, activateRapidFire } from './game-engine.js';
import { Galaxip } from './ships/galaxip.js';
import { Sentryxip } from './ships/sentryxip.js';
import { Commandxip } from './ships/commandxip.js';
import { Destroyerxip } from './ships/destroyerxip.js';
import { PLAYER, ALIEN, FIGHTER, SENTRY, COMMAND } from './constants.js';

let life;
let kills;
let gameStarted = false;

let formationWave1 = [
  '  CCCCC  ',
  'SSSSSSSSS',
  'SSSSSSSSS'
];
let formationWave2 = [
  '  CCCCC  ',
  'SCSSCSSCS',
  'SSSSSSSSS'
];
let formationWave3 = [
  'SSCCCCCSS',
  'SCCSCSCCS',
  'SSSSSSSSS'
];
let formationWave4 = [
  '  D  D   ',
  'SSCCCCCSS',
  'SCSSCSSCS'
];
let allFormations = [formationWave1, formationWave2, formationWave3, formationWave4];

let killStreak;
let DUAL_GUNS_AT = 50;
let dualGunsActivated;
let RAPID_FIRE_AT = 100;
let rapidFireActivated;
let BONUS_LIFE_AT = 200;
let bonusLifeActivated;

let MAX_WAVES = 100;

function reset() {
  life = 3;
  kills = Array.from({length:MAX_WAVES}, () => (new Map([[SENTRY, 0], [COMMAND, 0], ['bonus', 0]])));
  resetKillStreak();
}

function resetKillStreak() {
  killStreak = 0;
  dualGunsActivated = false;
  rapidFireActivated = false;
  bonusLifeActivated = false;
  updateAndDisplayKillStreakBonus();
}

function setupGame() {
  initiateAndAddPlayer();
  initiateAndAddAliens();
  updatePlayerWaves();
}

function initiateAndAddPlayer() {
  let galaxip = new Galaxip({
    x: 47, y: 35, armor: 2, team: PLAYER, onDeactivated: onShipDeactivated
  });
  addPlayer(galaxip);
}

function initiateAndAddAliens() {
  let armorMultiplier = 1 + getWave()/4;
  let formation = allFormations[getWave()%4];
  for (let l=0; l<formation.length; l++) {
    let line = formation[l];
    for (let c=0; c<line.length; c++) {
      switch(line.charAt(c)) {
        case 'D':
          addAlien(new Destroyerxip({
            x: (10 + c*7), y: (1 + l*4), armor: Math.floor(20 * armorMultiplier), 
            team: ALIEN, onDeactivated: onShipDeactivated
          }));
          break;
        case 'C':
          addAlien(new Commandxip({
            x: (10 + c*7), y: (1 + l*4), armor: Math.floor(8 * armorMultiplier), 
            team: ALIEN, onDeactivated: onShipDeactivated
          }));
          break;
        case 'S':
          addAlien(new Sentryxip({
            x: (10 + c*7), y: (1 + l*4), armor: Math.floor(5 * armorMultiplier), 
            team: ALIEN, onDeactivated: onShipDeactivated
          }));
          break;
        case ' ':
          break;
      }
    }
  }
}

function onShipDeactivated(ship) {
  if (ship.xipClass === FIGHTER) {
    life--;
    resetKillStreak();
    updatePlayerLives();
    if (life > 0) 
      initiateAndAddPlayer();
    else {
      gameStarted = false;
      document.getElementById('game-restart').style = 'display: block';
    }
  }
  else {
    incrementKillStreak();
    kills[getWave()].set(ship.xipClass, kills[getWave()].get(ship.xipClass)+1);
    if (ship.kamikaze) kills[getWave()].set('bonus', kills[getWave()].get('bonus')+1)
    calculateAndDisplayPoints();
    if (aliensCount() == 0) {
      incrementWave();
      if (getWave() >= MAX_WAVES) {
        document.getElementById('game-over').style = 'display: block';
        return;
      }
      initiateAndAddAliens();
      updatePlayerWaves();
    }
  }
  updateAndDisplayKillStreakBonus();
}

function incrementKillStreak() {
  killStreak++;
  if (killStreak > DUAL_GUNS_AT && !dualGunsActivated) {
    activateDualGuns();
    dualGunsActivated = true;
  }
  if (killStreak > RAPID_FIRE_AT && !rapidFireActivated) {
    activateRapidFire();
    rapidFireActivated = true;
  }
  if (killStreak > BONUS_LIFE_AT && !bonusLifeActivated) {
    life++;
    updatePlayerLives();
    bonusLifeActivated = true;
  }
}

function updateAndDisplayKillStreakBonus() {
  document.getElementById('kill-streak-info').style = 'display: grid';
  document.getElementById('dual-guns-bonus').style = dualGunsActivated ? 'display: block' : 'display: none';
  document.getElementById('rapid-fire-bonus').style = rapidFireActivated ? 'display: block' : 'display: none';
  document.getElementById('life-bonus').style = bonusLifeActivated ? 'display: block' : 'display: none';
}

function calculateAndDisplayPoints() {
  document.getElementById('player-points').innerHTML = 'Score: '+calculatePoints();
}

function calculatePoints() {
  let points = 0;
  for (let w=0; w <= getWave(); w++) {
    points += kills[w].get(SENTRY) * (30 + w * 30);
    points += kills[w].get(COMMAND) * (50 + w * 50);
    points += kills[w].get('bonus') * (50 + w * 70);
  }
  return points;
}

function updatePlayerLives() {
  document.getElementById('player-lives').innerHTML = 'Lives: '+life;
}

function updatePlayerWaves() {
  document.getElementById('player-waves').innerHTML = 'Waves: '+(getWave()+1);
}

document.addEventListener('keydown', event => {
  if (event.key === 'Enter' && !gameStarted) {
    startGame();
    reset();
    setupGame();
    calculateAndDisplayPoints();
    updatePlayerLives();
    gameStarted = true;
    document.getElementById('game-menu').style = 'display: none';
    document.getElementById('game-restart').style = 'display: none';
  }
});

document.getElementById('game-restart').style = 'display: none';
document.getElementById('game-over').style = 'display: none';
document.getElementById('kill-streak-info').style = 'display: none';
