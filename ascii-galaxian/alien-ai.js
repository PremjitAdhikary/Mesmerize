import { SCREEN_WIDTH, LEFT, RIGHT } from './constants.js';

export function moveAliens(aliens, alienMoveDirection, player) {
  moveKamikazeAliens(aliens, player);
  return moveAliensInFormation(aliens, alienMoveDirection);
}

function moveKamikazeAliens(aliens, player) {
  let aliensToMove = aliens.filter(alien => alien.active && alien.kamikaze);
  if (aliensToMove.length == 0) return;
  aliensToMove.forEach(alien => {
    alien.down();
    if (player.active && player.x > alien.x + alien.padding) alien.right();
    else if (player.active && player.x < alien.x - alien.padding) alien.left();
  });
}

function moveAliensInFormation(aliens, alienMoveDirection) {
  let aliensToMove = aliens.filter(alien => alien.active && !alien.kamikaze);
  if (aliensToMove.length == 0) return alienMoveDirection;
  if (alienMoveDirection === LEFT) {
    let leftMostAlienX = aliensToMove
      .map(alien => alien.leftTip()).reduce((min, x) => Math.min(x, min), 1000);
    if (leftMostAlienX < 7) 
      return RIGHT;
    aliensToMove.forEach(alien => alien.left());
  } else if (alienMoveDirection === RIGHT) {
    let righttMostAlienX = aliensToMove
      .map(alien => alien.rightTip()).reduce((max, x) => Math.max(x, max), 0);
    if (righttMostAlienX > SCREEN_WIDTH - 7) 
      return LEFT;
    aliensToMove.forEach(alien => alien.right());
  }
  return alienMoveDirection;
}

export function aliensAttack(aliens, player, wave) {
  kamikazeAttack(aliens, player, wave);
  bombsAttack(aliens, wave);
}

function kamikazeAttack(aliens, player, wave) {
  let totalKamikazeAliens = aliens.filter(alien => alien.active && alien.kamikaze).length;
  let totalAllowed = Math.floor(wave/3);
  if (!player.active || totalKamikazeAliens >= totalAllowed) return;
  if (!chance(wave/2)) return;
  let attacker = randomShipFromFormation(aliens);
  if (attacker != undefined) {
    attacker.kamikazeMode();
  }
}

function bombsAttack(aliens, wave) {
  let aliensToAttack = aliens.filter(alien => alien.active && !alien.kamikaze);
  if (aliensToAttack.length == 0) return;
  if (!chance((wave*4) + (30-aliensToAttack.length)/3)) return;
  let attacker = randomShipFromFormation(aliens);
  if (attacker != undefined)
    attacker.attack();
}

function randomShipFromFormation(aliens) {
  let aliensToAttack = aliens.filter(alien => alien.active && !alien.kamikaze);
  let xForActiveAliens = Array.from(new Set(aliensToAttack.map(alien => alien.x)));
  let bottomMostAlienAtX = x => aliensToAttack
    .filter(alien => x == alien.x)
    .reduce((a,b) => a.y < b.y ? b : a);
  let aggressiveAliens = xForActiveAliens.map(x => bottomMostAlienAtX(x));
  return aggressiveAliens[Math.floor(Math.random() * aggressiveAliens.length)];
}

function chance(successPercentage) {
  return successPercentage > Math.floor(Math.random() * 100);
}