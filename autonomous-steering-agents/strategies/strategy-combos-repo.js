/**
 * Contain in a region and wander there 
 */
const randomContainmentStrategy = environments => {
  let containmentStrategy = new Containment(environments);
  containmentStrategy.showAhead(true);
  let wanderStrategy = new Wander();
  
  let strategy = new ComboStrategy();
  strategy.addStrategy(containmentStrategy, 'contain', 2).addStrategy(wanderStrategy, 'wander', 1);
  strategy.lookAhead = ahead => {
    containmentStrategy.lookAhead(ahead);
    wanderStrategy.wanderDistance(ahead);
  };
  return strategy;
};

/**
 * Follow a Path with multiple vechicles on it.
 */
const crowdedPathFollowingStrategy = (path, vehicles) => {
  let pathStrategy = new FollowPath(path);
  let separationStrategy = new Separation(vehicles);

  let strategy = new ComboStrategy();
  strategy.addStrategy(pathStrategy, 'path', 3).addStrategy(separationStrategy, 'separate', 1);
  strategy.lookAhead = ahead => {
    pathStrategy.lookAhead(ahead);
  };
  return strategy;
};

/**
 * Multiple vechiles wander in a restricted region
 */
const collisionAvoidanceStrategy = (environments, vehicles) => {
  let containmentStrategy = new Containment(environments);
  let separationStrategy = new Separation(vehicles);
  let wanderStrategy = new Wander();
  let strategy = new ComboStrategy();
  strategy.addStrategy(containmentStrategy, 'contain', 2)
    .addStrategy(wanderStrategy, 'wander', 0.5)
    .addStrategy(separationStrategy, 'separate', 1);
  strategy.lookAhead = ahead => {
    containmentStrategy.lookAhead(ahead);
    wanderStrategy.wanderDistance(ahead);
  };
  return strategy;
};

/**
 * Multiple vehicles go to a doorway and try to maintain a queue 
 */
const doorwayQueuingStrategy = (environments, vehicles) => {
  let target = addDummyTarget(SketchColor.black().stringify(), 20, width / 2, -20);
  let seekStrategy = new Seek(target);
  let containmentStrategy = new Containment(environments);
  let separationStrategy = new Separation(vehicles);
  let strategy = new ComboStrategy();
  strategy.addStrategy(seekStrategy, 'seek', 1)
    .addStrategy(containmentStrategy, 'contain', 2)
    .addStrategy(separationStrategy, 'separate', 2.9);
  strategy.lookAhead = ahead => containmentStrategy.lookAhead(ahead);
  return strategy;
};

/**
 * Self explanatory 
 */
const followTheLeader = (vehicles, leader) => {
  let separationStrategy = new Separation(vehicles, 40);
  let followStrategy = new FollowLeader(leader);
  let strategy = new ComboStrategy();
  strategy.addStrategy(followStrategy, 'follow', 1.5)
    .addStrategy(separationStrategy, 'separate', 2.5);
  return strategy;
};

/**
 * Flock, Herd movement 
 */
const flock = vehicles => {
  let separationStrategy = new Separation(vehicles, 30);
  let alignStrategy = new Alignment(vehicles, 40);
  let cohesionStrategy = new Cohesion(vehicles, 50);
  let strategy = new ComboStrategy();
  strategy.addStrategy(separationStrategy, 'separate', 1.5)
    .addStrategy(alignStrategy, 'align', 1)
    .addStrategy(cohesionStrategy, 'cohesion', 1);
  return strategy;
};