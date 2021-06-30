// Collects all the Actor Builders in one place

/**
 * Simplest of all builders. Builds a Land Actor for the land tile in the world at (r,c) 
 * coordinate and returns it.
 */
const landBuilder = (world, r, c) => {
  let l = new Land(world, r, c, landBuilder);
  return l;
}

/**
 * Builds a Fly for the Moving World.
 * Moves (flies over water) in a random manner and lands on Land.
 * Grow is added so that it never runs out of energy.
 */
const flyBuilder = (world, r, c) => {
  let fly = new Fly(world, r, c);
  
  let moveEnergyCost = 10;
  let moveRange = 4;
  let flyOverLandCriteria = () => andCriteria(
    actorHasEnergy(fly, moveEnergyCost),
    findTargetLocation(fly, moveRange, a => a._type == Land.TYPE)
  );
  fly.addBehaviour(new Move(fly, moveEnergyCost, flyOverLandCriteria()));
  
  let growBy = 2;
  let growUpto = 100;
  fly.addBehaviour(new Grow(fly, growBy, growUpto));
  fly.simulateGrowth(false);
  return fly;
};

/**
 * Build a turtle for the moving world.
 * Moves along the edge of land, that is, swims in shallow water.
 * Grow is added so that it never runs out of energy..
 */
const turtleBuilder = (world, r, c) => {
  let turtle = new Turtle(world, r, c);

  let moveEnergyCost = 1;
  let moveRange = 1;
  let swimInShallowWaterCriteria = () => andCriteria(
    actorHasEnergy(turtle, moveEnergyCost),
    andCriteria(
      findEmptyLocation(turtle, moveRange),
      filterFoundLocationsWithCriteria(turtle, 
        v => world._electronicEnvironment._envData[v.x][v.y] == ElectronicEnvironment.WATER_EDGE))
  );
  turtle.addBehaviour(new Move(turtle, moveEnergyCost, swimInShallowWaterCriteria()));
  
  let growBy = 2;
  let growUpto = 50;
  turtle.addBehaviour(new Grow(turtle, growBy, growUpto));
  turtle.simulateGrowth(false);
  return turtle;
};

/**
 * Builds a Lily
 * Reproduces and Grows
 */
const lilyBuilder = (world, r, c) => {
  let lily = new Lily(world, r, c, lilyBuilder);
  lily.addBehaviour(new Die(lily));

  let reproductionEnergyCost = 35;
  let reproductionChance = 40;
  lily.addBehaviour(new Reproduce(
    lily, reproductionEnergyCost, reproductionEnergyCost+10, reproductionChance));
  
  let growBy = 0.5;
  let growUpto = 120;
  lily.addBehaviour(new Grow(lily, growBy, growUpto));
  return lily;
};

/**
 * Builds a greedy worm.
 * Eats lilys - and very greedy about it. Any Lily it finds around, it consumes.
 */
const greedyWormBuilder = (world, r, c) => {
  let worm = new Worm(world, r, c, greedyWormBuilder);

  let huntEnergyCost = 3;
  let huntRange = 1;
  let huntCriteria = () => andCriteria(
    actorHasEnergy(worm, huntEnergyCost),
    findTargetLocation(worm, huntRange, 
      target => target._type == Lily.TYPE && target.isAlive())
  );

  return wormBuilder(worm, huntEnergyCost, huntCriteria);
};

/**
 * Builds a smart worm.
 * Eats lilys - and very smart about it.
 * - Doesnt eat any Lily if the worm is full
 * - Doesnt eat young Lily, (the lily will have very less energy)
 * - If there is only 1 Lily in the vicinity, let's it live so that the Lily population doesn't 
 *   go extinct
 */
const smartWormBuilder = (world, r, c) => {
  let worm = new Worm(world, r, c, smartWormBuilder);

  let highEnergy = 120;
  let huntEnergyCost = 3;
  let huntRange = 1;
  let huntCriteria = () => andCriteria(
    andCriteria(
      notCriteria(actorHasEnergy(worm, highEnergy)),
      actorHasEnergy(worm, huntEnergyCost)
    ), 
    andCriteria(
      findTargetLocation(worm, huntRange, 
        target => 
          target._type == Lily.TYPE 
          && target.isAlive() 
          && !target.isChild()
        ),
      () => worm._foundLocations.length >= 2
    )
  );

  return wormBuilder(worm, huntEnergyCost, huntCriteria);
};

/**
 * Adds in the common behavior in the worm
 * - Die
 * - Reproduction
 * - Eat: based on greedy/smart, the hunt criteria differs
 * - Move: the worm moves on water, and needs empty water tile to move into
 * - Upkeep
 */
const wormBuilder = (worm, huntEnergyCost, huntCriteria) => {
  worm.addBehaviour(new Die(worm));

  let reproductionEnergyCost = 50;
  let reproductionChance = 25;
  worm.addBehaviour(new Reproduce(
    worm, reproductionEnergyCost, reproductionEnergyCost+10, reproductionChance));

  worm.addBehaviour(new Eat(worm, huntEnergyCost, Lily.TYPE, huntCriteria()));
  
  let moveEnergyCost = 1.5;
  let moveRange = 1;
  let swimInWaterCriteria = () => andCriteria(
    actorHasEnergy(worm, moveEnergyCost),
    findEmptyLocation(worm, moveRange)
  );
  worm.addBehaviour(new Move(worm, moveEnergyCost, swimInWaterCriteria()));

  worm.addBehaviour(new Upkeep(worm, 5));
  return worm;
};

/**
 * Builds a greedy fish.
 * Eats worms - and very greedy about it. Any Worm it finds around, it consumes.
 */
const greedyFishBuilder = (world, r, c) => {
  let fish = new Fish(world, r, c, greedyFishBuilder);

  let huntEnergyCost = 3;
  let huntRange = 1;
  let huntCriteria = () => andCriteria(
    actorHasEnergy(fish, huntEnergyCost),
    findTargetLocation(fish, huntRange, 
      prey => prey._type == Worm.TYPE && prey.isAlive())
  );

  return fishBuilder(fish, huntEnergyCost, huntCriteria);
};

/**
 * Builds a smart fish.
 * Eats worms - and very smart about it.
 * - Doesnt eat any Wrom if the fish is full
 * - Doesnt eat young fishes, (the fish will have very less energy)
 * - If there are more fishes, hunts aggressively, otherwise pacifies itself. This is achieved 
 *   by keeping a datastructure of previous seen number of worms during its hunt. If there are 
 *   more worms, then this datastructure will reflect it. So our algorithm is that if the average 
 *   worm seen over a particular period goes above a threshold, go for the kill.
 */
const smartFishBuilder = (world, r, c) => {
  let fish = new Fish(world, r, c, smartFishBuilder);

  let highEnergy = 450;
  let huntEnergyCost = 3;
  let huntRange = 1;
  let preySeenDaysToCheck = 5;
  let minPreySeenAvg = 1.3;
  let huntPreyCriteria = () => {
    findTargetLocation(fish, huntRange, 
      prey => 
        prey._type == Worm.TYPE 
        && prey.isAlive() 
        && !prey.isChild()
      )();
    if (fish._preySeen == null) 
      fish._preySeen = [];
    fish._preySeen.push(fish._foundLocations.length);
    if (fish._preySeen.length < preySeenDaysToCheck) 
      return false;
    if (fish._preySeen.length == preySeenDaysToCheck+1) 
      fish._preySeen.shift();
    let seenAvg = fish._preySeen.reduce((a,b) => a+b, 0) / preySeenDaysToCheck;
    return seenAvg > minPreySeenAvg;
  };
  let huntCriteria = () => 
    andCriteria(
      andCriteria(
        notCriteria(actorHasEnergy(fish, highEnergy)),
        actorHasEnergy(fish, huntEnergyCost)
      ), 
    huntPreyCriteria
  );

  return fishBuilder(fish, huntEnergyCost, huntCriteria);
};

/**
 * Adds in the common behavior in the fish
 * - Die
 * - Reproduction
 * - Eat: based on greedy/smart, the hunt criteria differs
 * - Move: the fish moves under water, and can move under Lily too, so doesn't get trapped
 * - Upkeep
 */
const fishBuilder = (fish, huntEnergyCost, huntCriteria) => {
  fish.addBehaviour(new Die(fish));

  let reproductionEnergyCost = 400;
  let reproductionChance = 25;
  fish.addBehaviour(new Reproduce(
    fish, reproductionEnergyCost, reproductionEnergyCost+10, reproductionChance));

  fish.addBehaviour(new Eat(fish, huntEnergyCost, Worm.TYPE, huntCriteria()));
  
  let moveEnergyCost = 2;
  let moveRange = 1;
  let swimInWaterCriteria = () => andCriteria(
    actorHasEnergy(fish, moveEnergyCost),
    () => findLocationWithCondition(fish, moveRange, 
      dataCell => !dataCell.some(actor => actor._type == Land.TYPE)
    )
  );
  fish.addBehaviour(new Move(fish, moveEnergyCost, swimInWaterCriteria()));

  fish.addBehaviour(new Upkeep(fish, 5));
  return fish;
};

/**
 * Build a fly which pollinates.
 * Few existing fly properties are updated and new properties are added to build the pollinator.
 * - Collect
 * - GoHome
 */
const pollinatorFlyBuilder = (world, r, c) => {
  let fly = new Fly(world, r, c);
  
  // adjust initiatial capabilities for pollinator
  fly._energy = 10;
  fly._mover.setTopSpeed(4);

  // add pollinator specific properties
  fly._nectar = 0;
  fly._collectedFrom = [];
  fly.atHome = () => {
    let cellLoc = fly._hive._cellMap.get(fly._hiveCell);
    return (cellLoc.x == fly._r && cellLoc.y == fly._c);
  };
  
  let collectEnergyCost = 1.5;
  let collectRange = 4;
  let goHomeEnergyCost = 1;
  let ratioToCollect = 0.2;
  let maxToCollect = 15;
  let collectFromUnvisitedLily = collectFrom => 
    collectFrom._type == Lily.TYPE 
    && (fly._collectedFrom == null || !fly._collectedFrom.some(c => c == collectFrom))
  let collectCriteria = () => andCriteria(
    actorHasEnergy(fly, collectEnergyCost + goHomeEnergyCost), 
    findTargetLocation(fly, collectRange, collectFromUnvisitedLily)
  );
  fly.addBehaviour(new Collect(
    fly, 
    collectEnergyCost, 
    Lily.TYPE, 
    collectCriteria(), 
    ratioToCollect, 
    maxToCollect));
  
  let depositNectar = () => {
    fly._collectedFrom = [];
    fly._hive.depositNectar(fly._nectar);
    fly._nectar = 0;
  };
  fly.addBehaviour(new GoHome(fly, goHomeEnergyCost, depositNectar));
  return fly;
};

/**
 * Builds a queen which can populate the hive with pollinators
 * Few existing fly properties are updated and new properties are added to build the queen.
 * - HiveReproduce
 * - QueenTour
 * - GoHome
 * - Upkeep
 */
const queenBuilder = (world, r, c) => {
  let queen = new Fly(world, r, c, pollinatorFlyBuilder);
  let queenInitEnergy = 500;
  
  // adjust initiatial capabilities for queen
  queen._adultAge = 50;
  queen._adultLen = height / world._data.length * 1.5;
  queen._childLen = queen._adultLen / 2;
  queen._energy = queenInitEnergy;
  queen._mover.setTopSpeed(2);

  // add queen specific properties
  queen.atHome = () => {
    return (queen._hive._r == queen._r && queen._hive._c == queen._c);
  };

  let reproductionEnergyCost = 250;
  let reproductionChance = 25;
  queen.addBehaviour(new HiveReproduce(
    queen, reproductionEnergyCost, reproductionEnergyCost+queenInitEnergy, reproductionChance));

  let tourEnergyCost = 2000;
  queen.addBehaviour(new QueenTour(queen, tourEnergyCost, tourEnergyCost + queenInitEnergy));

  let goHomeEnergyCost = 1;
  let resetCoordinates = () => {
    queen._r = queen._hive._r;
    queen._c = queen._hive._c;
  };
  queen.addBehaviour(new GoHome(queen, goHomeEnergyCost, resetCoordinates));
  queen.addBehaviour(new Upkeep(queen, 1));

  return queen;
}

/**
 * Builds a Lilly which propagates by pollination
 * - PollinateAndReproduce
 * - Grow
 */
const pollinatingLilyBuilder = (world, r, c) => {
  let lily = new Lily(world, r, c, pollinatingLilyBuilder);

  let reproductionEnergyCost = 35;
  let reproductionChance = 40;
  lily.addBehaviour(new PollinateAndReproduce(
    lily, reproductionEnergyCost, reproductionEnergyCost+10, reproductionChance));
  
  let growBy = 0.5;
  let growUpto = 120;
  lily.addBehaviour(new Grow(lily, growBy, growUpto));

  return lily;
};