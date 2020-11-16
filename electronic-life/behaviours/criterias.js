/**
 * Most Common criterias are listed here
 */

const notCriteria = (criteria) => () => !criteria();

const andCriteria = (criteriaA, criteriaB) => () => criteriaA() && criteriaB();

const orCriteria = (criteriaA, criteriaB) => () => criteriaA() || criteriaB();

// actor has atleast this much energy
const actorHasEnergy = (actor, energy) => () => actor._energy >= energy;

// if the actor doesnt have growMax amount of energy
const growCriteria = (actor, growMax) => notCriteria(actorHasEnergy(actor, growMax));

// chance in 100
const chanceCriteria = (chance) => () => random(0, 100) < chance;

// whether a co-ordinate is inside the world grid
const insideWorld = (world, r, c) => 
    r >= 0 && r < world._data.length && c >= 0 && c < world._data[0].length;

// from the actors co-ordinate find locations within range based on a certain condition.
// add the found locations to actor._foundLocations.
// return true if at least one location is found
const findLocationWithCondition = (actor, range, condition) => {
  actor._foundLocations = [];
  for (let a=-range; a<=range; a++) {
    for (let b=-range; b<=range; b++) {
      if (a == 0 && b == 0) continue; // skip current location
      if (insideWorld(actor._world, actor._r+a, actor._c+b) 
        && condition(actor._world._data[actor._r+a][actor._c+b])) {
          actor._foundLocations.push(createVector(actor._r+a, actor._c+b));
      }
    }
  }
  return actor._foundLocations.length > 0;
}

// self explanatory
const findEmptyLocation = (actor, range) => () => findLocationWithCondition(
  actor, range, dataCell => dataCell.length == 0);

// find location based on a targetFindFunction to be executed against the world grid data cell 
// array
const findTargetLocation = (actor, range, targetFindFunction) => () => findLocationWithCondition(
  actor, range, dataCell => dataCell.some(targetFindFunction));

// Returns true if the actor has energyRequired to reproduce and is lucky
const reproduceCriteria = (actor, energyRequired, chance) => andCriteria(
  andCriteria(
    actorHasEnergy(actor, energyRequired),
    chanceCriteria(chance)
  ),
  findEmptyLocation(actor, 1)
);

// filter the found locations based on filterFunction and return true if at least one location 
// still remains
const filterFoundLocationsWithCriteria = (actor, filterFunction) => () => {
  actor._foundLocations = actor._foundLocations.filter(filterFunction);
  return actor._foundLocations.length > 0;
};

// This is for pollination. While the energy and chance criteria remains the same, additional 
// criteria includes checking for whether the plant has been pollinated or not. So either 
// the pollinator had pollen, in which case the plant finds an empty space around it to reproduce 
// or the pollinator didn't have pollen in which case this plant will give it's own pollen for 
// the pollinator to carry ahead.
const pollinateAndReproduceCriteria = (actor, energyRequired, chance) => andCriteria(
  andCriteria(
    actorHasEnergy(actor, energyRequired),
    chanceCriteria(chance)
  ),
  orCriteria(
    andCriteria(
      () => actor._pollinator && actor._pollinator._pollen,
      findEmptyLocation(actor, 1)
    ),
    () => actor._pollinator && !actor._pollinator._pollen
  )
);

// This is for reproduction of pollinators in hive. Agan the energy and chance criteria remains 
// the same. But additional check is to ensure that the hive has space for more pollinators
const hiveReproduceCriteria = (actor, energyRequired, chance) => andCriteria(
  andCriteria(
    actorHasEnergy(actor, energyRequired),
    chanceCriteria(chance)
  ),
  () => actor._hive._pollinatorsInHive.length < actor._hive._maxPollinatorsInHive
);