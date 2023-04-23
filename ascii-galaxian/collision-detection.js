import { SCREEN_WIDTH, SCREEN_HEIGHT, PROJECTILE, SHIP } from './constants.js';

export function checkForCollisions(gameObjects) {
  let possibleCollisions = broadPhaseCollisionDetection(gameObjects);
  narrowPhaseCollisionDetection(possibleCollisions);
}

function broadPhaseCollisionDetection(gameObjects) {
  let splits = 4;
  let indexCalculator = (x,y) => x*splits+y;
  let maybeCollides = Array.from(Array(splits*splits), () => new Set());
  let splitW = Math.ceil(SCREEN_WIDTH/splits);
  let splitH = Math.ceil(SCREEN_HEIGHT/splits);

  gameObjects.filter(obj => obj.active).forEach(obj => {
    if (obj.type === PROJECTILE && !pointBeyond(obj.x, obj.y)) {
      maybeCollides[indexCalculator(Math.floor(obj.y/splitH), Math.floor(obj.x/splitW))].add(obj);
    } else if (obj.type === SHIP) {
      let bb = obj.boundingBox();
      if (pointBeyond(bb.x, bb.y) || pointBeyond((bb.x+bb.w-1), (bb.y+bb.h-1))) return;
      if (maybeCollides[indexCalculator(Math.floor(bb.y/splitH), Math.floor(bb.x/splitW))] === undefined) {
        console.log(pointBeyond(bb.x, bb.y));
        console.log(pointBeyond((bb.x+bb.w-1), (bb.y+bb.h-1)));
        console.log(bb)
      }
      maybeCollides[indexCalculator(Math.floor(bb.y/splitH), Math.floor(bb.x/splitW))].add(obj);
      maybeCollides[indexCalculator(Math.floor((bb.y+bb.h-1)/splitH), Math.floor(bb.x/splitW))].add(obj);
      maybeCollides[indexCalculator(Math.floor(bb.y/splitH), Math.floor((bb.x+bb.w-1)/splitW))].add(obj);
      maybeCollides[indexCalculator(Math.floor((bb.y+bb.h-1)/splitH), Math.floor((bb.x+bb.w-1)/splitW))].add(obj);
    }
  });

  return maybeCollides;
}

function narrowPhaseCollisionDetection(maybeCollides) {
  for (let c of maybeCollides) {
    if (c.size == 0) continue;
    let colliders = Array.from(c);
    for (let i=0; i<colliders.length-1; i++) {
      if (!colliders[i].active) continue;
      for (let j=i+1; j<colliders.length; j++) {
        if (checkAndApplyCollision(colliders[i], colliders[j])) 
          continue;
      }
    }
  }
}

function checkAndApplyCollision(obj1, obj2) {
  if (!obj2.active 
      || isOnSameTeam(obj1, obj2) 
      || bothProjectiles(obj1, obj2)) return true;
  if (projectileAndShip(obj1, obj2) 
      && !obj2.isHit 
      && pointRectangleOverlap(obj1, obj2)) {
    obj1.hit();
    obj2.hit(obj1.damage);
    return true;
  }
  if (shipAndProjectile(obj1, obj2) 
      && !obj1.isHit 
      && pointRectangleOverlap(obj2, obj1)) {
    obj1.hit(obj2.damage);
    obj2.hit();
    return true;
  }
  if (bothShips(obj1, obj2) 
      && !obj1.isHit && !obj2.isHit 
      && rectangleRectangleOverlap(obj1, obj2)) {
    obj1.hit(100);
    obj2.hit(100);
    return true;
  }
}

let isOnSameTeam = (obj1, obj2) => obj1.team === obj2.team;
let bothProjectiles = (obj1, obj2) => 
    obj1.type === PROJECTILE && obj2.type === PROJECTILE;
let bothShips = (obj1, obj2) => 
    obj1.type === SHIP && obj2.type === SHIP;
let projectileAndShip = (obj1, obj2) => 
    obj1.type === PROJECTILE && obj2.type === SHIP;
let shipAndProjectile = (obj1, obj2) => 
    obj1.type === SHIP && obj2.type === PROJECTILE;

function pointRectangleOverlap(obj1, obj2) {
  let px = obj1.x, py = obj1.y;
  let r = obj2.boundingBox();
  return px >= r.x && px < (r.x+r.w) && py >= r.y && py < (r.y+r.h);
}

function rectangleRectangleOverlap(obj1, obj2) {
  let r1 = obj1.boundingBox();
  let r2 = obj2.boundingBox();
  return !(r1.x >= (r2.x+r2.w) || r2.x >= (r1.x+r1.w) 
    || r1.y >= (r2.y+r2.h) || r2.y >= (r1.y+r1.h));
}

function pointBeyond(x, y) {
  return x < 0 || x > SCREEN_WIDTH-1 || y < 0 || y > SCREEN_HEIGHT-1;
}