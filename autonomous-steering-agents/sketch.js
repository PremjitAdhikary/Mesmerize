let canvas;

let choice_main;
let choice_simple;
let choice_combined;

let seek_max_speed;
let seek_max_force;

let flee_max_speed;
let flee_max_force;

let pursue_max_speed;
let pursue_max_force;
let pursue_prediction;
let pursue_target_speed;

let evasion_max_speed;
let evasion_max_force;
let evasion_prediction;
let evasion_target_speed;

let wander_max_speed;
let wander_max_force;
let wander_angle_change;
let wander_radius;
let wander_distance;

let arrival_max_speed;
let arrival_max_force;
let arrival_slow_radius;

let offset_pursuit_max_speed;
let offset_pursuit_max_force;
let offset_pursuit_target_speed;
let offset_pursuit_offset;

let obstacle_max_speed;
let obstacle_max_force;
let obstacle_avoidance_ahead;

let containment_max_speed;
let containment_max_force;
let containment_ahead;

let wall_following_max_speed;
let wall_following_max_force;
let wall_following_ahead;
let wall_following_offset;

let path_following_max_speed;
let path_following_max_force;
let path_following_ahead;
let path_following_radio;

let flow_field_max_speed;
let flow_field_max_force;
let flow_field_ahead;
let flow_field_radio;

let crowd_path_following_max_speed;
let crowd_path_following_max_force;
let crowd_path_following_ahead;

let collision_avoidance_max_speed;
let collision_avoidance_max_force;
let collision_avoidance_ahead;

let queuing_max_speed;
let queuing_max_force;
let queuing_ahead;

let leader_max_speed;
let leader_max_force;
let leader_distance;
let follower_max_speed;
let follower_max_force;

let flocking_max_speed;
let flocking_max_force;

let vehicles;
let targets;
let paths;
let environments;
let flowFields;

function setup() {
  canvas = createCanvas(640, 480);
  canvas.parent('sketch-holder');
  init();
}

function draw() {
  background(0);
  environments.forEach(e => e.show());
  flowFields.forEach(f => f.show());
  paths.forEach(p => p.show());
  targets.forEach(t => t.show());
  vehicles.forEach(v => {
    v.act();
    v.update();
    v.show();
  });
}

function init() {
  initFunctions.get(choice_main*100 + (choice_main == 1 ? choice_simple : choice_combined))();
}

function setupSeek() {
  resetWorld();
  let target = addDummyTarget(SketchColor.gold().stringify(), 20);

  addBasicVehicle(new Seek(target), SketchColor.greenyellow().stringify(), 15);
  updateVehicles(seek_max_speed, seek_max_force);
}

function setupFlee() {
  resetWorld();
  let target = addDummyTarget(SketchColor.gold().stringify(), 20);

  addBasicVehicle(new Flee(target), SketchColor.skyblue().stringify(), 15);
  updateVehicles(flee_max_speed, flee_max_force);
}

function setupPursuit() {
  resetWorld();
  let target = addBouncingTarget(pursue_target_speed, SketchColor.orange().stringify(), 20);

  let strategy = new Pursuit(target);
  strategy.predictionMax(pursue_prediction).showPrediction(true);
  addBasicVehicle(strategy, SketchColor.greenyellow().stringify(), 15);
  updateVehicles(pursue_max_speed, pursue_max_force);
}

function setupEvasion() {
  resetWorld();
  let target = addBouncingTarget(evasion_target_speed, SketchColor.orange().stringify(), 20);

  let strategy = new Evasion(target);
  strategy.predictionMax(evasion_prediction).showPrediction(true);
  addBasicVehicle(strategy, SketchColor.skyblue().stringify(), 15);
  updateVehicles(evasion_max_speed, evasion_max_force);
}

function setupWander() {
  resetWorld();

  let strategy = new Wander();
  strategy.wanderAngleChange(wander_angle_change/100).wanderRadius(wander_radius)
    .wanderDistance(wander_distance).showWandering(true);
  addBasicVehicle(strategy, SketchColor.orange().stringify(), 15);
}

function setupArrival() {
  resetWorld();
  let target = addDummyTarget(SketchColor.gold().stringify(), 20);

  let strategy = new Arrival(target);
  strategy.slowRadius(arrival_slow_radius);
  addBasicVehicle(strategy, SketchColor.greenyellow().stringify(), 15);
  updateVehicles(arrival_max_speed, arrival_max_force);
}

function setupOffsetPursuit() {
  resetWorld();
  let target = addBouncingTarget(offset_pursuit_target_speed, SketchColor.orange().stringify(), 20);

  let strategy = new OffsetPursuit(target);
  strategy.updateOffsetRadius(offset_pursuit_offset).showPrediction(true);
  addBasicVehicle(strategy, SketchColor.greenyellow().stringify(), 15);
  updateVehicles(offset_pursuit_max_speed, offset_pursuit_max_force);
}

function setupObstacleAvoidance() {
  resetWorld();
  setupObstacles();

  let strategy = new ObstacleAvoidance(targets);
  strategy.lookAhead(obstacle_avoidance_ahead).showCollisions(true);
  addBasicVehicle(strategy, SketchColor.skyblue().stringify(), 15).resetVelocity();
  updateVehicles(obstacle_avoidance_max_speed, obstacle_avoidance_max_force);
}

function setupContainment() {
  resetWorld();
  addContainmentEnv();

  let strategy = randomContainmentStrategy(environments);
  strategy.lookAhead(containment_ahead);
  addBasicVehicle(strategy, SketchColor.skyblue().stringify(), 15, 
    150, width - 150, 150, height - 150);
  updateVehicles(containment_max_speed, containment_max_force);
}

function setupWallFollowing() {
  resetWorld();
  addContainmentEnv();

  let strategy = new FollowWall(environments);
  strategy.lookAhead(wall_following_ahead).offset(wall_following_offset).showPrediction(true);
  addBasicVehicle(strategy, SketchColor.skyblue().stringify(), 15, 
    150, width - 150, 150, height - 150);
  updateVehicles(wall_following_max_speed, wall_following_max_force);
}

function setupPathFollowing() {
  resetWorld();

  let path = generatePath(path_following_radio);
  paths.push(path);

  let strategy = new FollowPath(path);
  strategy.lookAhead(path_following_ahead).showPrediction(true);
  addBasicVehicle(strategy, SketchColor.greenyellow().stringify(), 15);
  addBasicVehicle(strategy, SketchColor.yellow().stringify(), 15);
  updateVehicles(path_following_max_speed, path_following_max_force);
  vehicles.forEach(v => v.resetVelocity());
}

function setupFlowField() {
  resetWorld();

  let flowField = new FlowField(40);
  if (flow_field_radio == 1)
    flowField.randomFlow();
  else 
    flowField.perlinFlow();
  flowFields.push(flowField);
  let strategy = new FollowField(flowField);
  addBasicVehicle(strategy, SketchColor.greenyellow().stringify(), 15);
  updateVehicles(flow_field_max_speed, flow_field_max_force);
  vehicles[0].resetVelocity();
}

function setupCrowdedPathFollowing() {
  resetWorld();
  
  let path = generatePath(3);
  paths.push(path);

  let strategy = crowdedPathFollowingStrategy(path, vehicles);
  strategy.lookAhead(crowd_path_following_ahead);
  for (let v = 0; v < 30; v++) {
    addBasicVehicle(strategy, SketchColor.greenyellow().stringify(), 10);
  }
  updateVehicles(crowd_path_following_max_speed, crowd_path_following_max_force);
  vehicles.forEach(v => v.resetVelocity());
}

function setupUnalignedCollisionAvoidance() {
  resetWorld();
  addContainmentEnv();

  let strategy = collisionAvoidanceStrategy(environments, vehicles);
  strategy.lookAhead(collision_avoidance_ahead);
  for (let v = 0; v < 50; v++) {
    addBasicVehicle(strategy, SketchColor.skyblue().stringify(), 10, 
      150, width - 150, 150, height - 150);
  }
  updateVehicles(collision_avoidance_max_speed, collision_avoidance_max_force);
  vehicles.forEach(v => v.resetVelocity());
}

function setupQueuing() {
  resetWorld();
  addQueingEnv();

  let strategy = doorwayQueuingStrategy(environments, vehicles);
  strategy.lookAhead(queuing_ahead);
  for (let v = 0; v < 20; v++) {
    let vehicle = addBasicVehicle(strategy, SketchColor.skyblue().stringify(), 10, 
      0, width, height/2, height);
    // once vehicle exists door, place it at the bottom or side
    vehicle.restrict = () => {
      if (vehicle.position.x > width + vehicle.size) {
        vehicle.position.x = -vehicle.size/2;
      } else if (vehicle.position.x < -vehicle.size) {
        vehicle.position.x = width + vehicle.size/2;
      }
      if ((vehicle.position.y > height + vehicle.size) 
        || (vehicle.position.y < -vehicle.size)) {
        let fromBelow = random(100) > 50;
        vehicle.position.x = (fromBelow ? Math.floor(random(width)) 
          : (random(100) > 50 ? 0 : width));
        vehicle.position.y = (fromBelow ? height + vehicle.size/2 
          : (Math.floor(random(height/2)) + height/2));
      }
    }
  }
  updateVehicles(queuing_max_speed, queuing_max_force);
  vehicles.forEach(v => v.resetVelocity());
}

function setupLeaderFollowing() {
  resetWorld();
  
  let leaderStrategy = new Wander();
  leaderStrategy.wanderAngleChange(20/100).wanderRadius(20).wanderDistance(leader_distance);
  let leader = addBasicVehicle(leaderStrategy, SketchColor.orange().stringify(), 10);

  let strategy = followTheLeader(vehicles, leader);
  for (let v = 0; v < 10; v++) {
    addBasicVehicle(strategy, SketchColor.greenyellow().stringify(), 10);
  }
  updateVehicles(follower_max_speed, follower_max_force);
  vehicles.forEach(v => v.resetVelocity());
  leader.maxSpeed = leader_max_speed;
  leader.maxForce = leader_max_force/100;
}

function setupFlocking() {
  resetWorld();

  let strategy = flock(vehicles);
  for (let v = 0; v < 40; v++) {
    addBasicVehicle(strategy, SketchColor.greenyellow().stringify(), 10);
  }
  updateVehicles(flocking_max_speed, flocking_max_force);
  vehicles.forEach(v => v.resetVelocity());
}

// setup helpers
function resetWorld() {
  paths = [];
  environments = [];
  flowFields = [];

  targets = [];
  vehicles = [];
}

function addDummyTarget(color, size, x = width/2, y =  height/2) {
  let target = new DummyTarget(x, y);
  if (color) {
    target._color = color;
  }
  if (size) {
    target._size = size;
  }
  targets.push(target);
  return target;
}

function addBouncingTarget(target_speed, color, size) {
  let target = new BouncingTarget(width/2, height/2);
  target.udpateMaxSpeed(target_speed);
  if (color) {
    target._color = color;
  }
  if (size) {
    target._size = size;
  }
  targets.push(target);
  return target;
}

function addBasicVehicle(strategy, color, size, 
    startX = 0, endX = width, startY = 0, endY = height) {
  let vehicle = new BasicVehicle(random(startX, endX), random(startY, endY));
  if (color) {
    vehicle._color = color;
  }
  if (size) {
    vehicle.size = size;
  }
  vehicle.addStrategy(strategy);
  vehicles.push(vehicle);
  return vehicle;
}

function addComboVehicle(color, size, startX = 0, endX = width, startY = 0, endY = height) {
  let vehicle = new ComboVehicle(random(startX, endX), random(startY, endY));
  if (color) {
    vehicle._color = color;
  }
  if (size) {
    vehicle._size = size;
  }
  vehicles.push(vehicle);
  return vehicle;
}

function updateVehicles(maxSpeed, maxForce) {
  vehicles.forEach(v => {
    v.maxSpeed = maxSpeed;
    v.maxForce = maxForce/100;
  });
}

function setupObstacles() {
  let targetPositions = [
    [0,0], [0,height], [width,0], [width,height], 
    [340, 360], [300,120], 
    [460, 110], [520,260], [500, 400],
    [120, 135], [195, 255], [140, 390]
  ];
  targetPositions.forEach( pos => addDummyTarget(SketchColor.gold().stringify(), 
    Math.round(random(70, 110)), pos[0], pos[1]));
}

function addContainmentEnv() {
  paths = [];
  let env = new BasicEnv();

  env.addUnreachableRectangle(-50,-50,270,50);
  env.addUnreachableRectangle(-50,-50,50,190);
  env.addUnreachableRectangle(370,-50,690,50);
  env.addUnreachableRectangle(590,-50,690,190);
  env.addUnreachableRectangle(-50,430,270,530);
  env.addUnreachableRectangle(-50,290,50,530);
  env.addUnreachableRectangle(370,430,690,530);
  env.addUnreachableRectangle(590,290,690,530);

  env.addWall([
    createVector(-50,190), createVector(50,190), createVector(50,50), 
    createVector(270,50), createVector(270,-50)
  ]);
  env.addWall([
    createVector(690,190), createVector(590,190), createVector(590, 50),
    createVector(370,50), createVector(370,-50)
  ]);
  env.addWall([
    createVector(-50, 290), createVector(50,290), createVector(50,430),
    createVector(270,430), createVector(270,530)
  ]);
  env.addWall([
    createVector(370, 530), createVector(370, 430), createVector(590,430), 
    createVector(590,290), createVector(690,290)
  ]);

  environments.push(env);
  return env;
}

function generatePath(choice) {
  let linearPath = [ [0, height/2], [width/5, height/2 - 50], [width*2/5, height/2 + 35],
    [width*3/5, height/2 + 25], [width*4/5, height/2 + 50], [width, height/2] ];
  let gap = 100;
  let circuitPath = [ [gap, gap], [width - gap, gap], [width - gap, height - gap],
    [width/2, height - gap * 1.5], [gap, height - gap] ];
  let crowdPath = [ [0, height/2], [width/5, height/2], [width/5, height/2 - 100], 
    [width/2, height/2 - 150], [width/2, height/2 + 150], [width*4/5, height/2 + 100], 
    [width*4/5, height/2], [width, height/2] ];
  let createPath = (points, wd, close = false) => {
    let path = new Path(wd, close);
    points.forEach( p => path.addPoints(p[0], p[1]) );
    return path;
  };
  if (choice == 1) {
    return createPath(linearPath, 50);
  } else if (choice == 2) {
    return createPath(circuitPath, 50, true);
  }  else if (choice == 3) {
    return createPath(crowdPath, 70);
  }
  return;
}

function addQueingEnv() {
  paths = [];
  let env = new BasicEnv();

  env.addUnreachableRectangle(-50,-50,270,100);
  env.addUnreachableRectangle(370,-50,690,100);

  env.addWall([
    createVector(-50,100), createVector(270,100), createVector(270,-50)
  ]);
  env.addWall([
    createVector(690,100), createVector(370,100), createVector(370,-50)
  ]);

  environments.push(env);
  return env;
}

let initFunctions = new Map();
initFunctions.set(101, setupSeek);
initFunctions.set(102, setupFlee);
initFunctions.set(103, setupPursuit);
initFunctions.set(104, setupEvasion);
initFunctions.set(105, setupWander);
initFunctions.set(106, setupArrival);
initFunctions.set(107, setupOffsetPursuit);
initFunctions.set(108, setupObstacleAvoidance);
initFunctions.set(109, setupContainment);
initFunctions.set(110, setupWallFollowing);
initFunctions.set(111, setupPathFollowing);
initFunctions.set(112, setupFlowField);
initFunctions.set(201, setupCrowdedPathFollowing);
initFunctions.set(202, setupUnalignedCollisionAvoidance);
initFunctions.set(203, setupQueuing);
initFunctions.set(204, setupLeaderFollowing);
initFunctions.set(205, setupFlocking);

function mouseClicked() {
  if (choice_main != 1) return;
  if (mouseInCanvas()) {
    if (choice_simple == 1 || choice_simple == 2 || choice_simple == 3 || choice_simple == 4 
      || choice_simple == 6 || choice_simple == 7) {
      targets[0]._position.x = mouseX;
      targets[0]._position.y = mouseY;
    } else if (choice_simple == 5 || choice_simple == 8 || choice_simple == 9 || 
      choice_simple == 10 || choice_simple == 12) {
      vehicles[0]._position.x = mouseX;
      vehicles[0]._position.y = mouseY;
    }
  }
}

function setBus(bus) {
  bus.register("ControlASAcm", e => {
    choice_main = e.detail.choice_main;
    init();
  });
  bus.register("ControlASAcr", e => {
    choice_simple = e.detail.choice_simple;
    init();
  });
  bus.register("ControlASAcrc", e => {
    choice_combined = e.detail.choice_combined;
    init();
  });

  bus.register("ControASAssms", e => {
    seek_max_speed = e.detail.seek_max_speed;
    updateVehicles(seek_max_speed, seek_max_force);
  });
  bus.register("ControASAssmf", e => {
    seek_max_force = e.detail.seek_max_force;
    updateVehicles(seek_max_speed, seek_max_force);
  });

  bus.register("ControASAsfms", e => {
    flee_max_speed = e.detail.flee_max_speed;
    updateVehicles(flee_max_speed, flee_max_force);
  });
  bus.register("ControASAsfmf", e => {
    flee_max_force = e.detail.flee_max_force;
    updateVehicles(flee_max_speed, flee_max_force);
  });

  bus.register("ControASAspms", e => {
    pursue_max_speed = e.detail.pursue_max_speed;
    updateVehicles(pursue_max_speed, pursue_max_force);
  });
  bus.register("ControASAspmf", e => {
    pursue_max_force = e.detail.pursue_max_force;
    updateVehicles(pursue_max_speed, pursue_max_force);
  });
  bus.register("ControASAspp", e => {
    pursue_prediction = e.detail.pursue_prediction;
    vehicles[0]._strategy.predictionMax(pursue_prediction);
  });
  bus.register("ControASAspts", e => {
    pursue_target_speed = e.detail.pursue_target_speed;
    targets[0].udpateMaxSpeed(pursue_target_speed);
  }); 

  bus.register("ControASAsems", e => {
    evasion_max_speed = e.detail.evasion_max_speed;
    updateVehicles(evasion_max_speed, evasion_max_force);
  });
  bus.register("ControASAsemf", e => {
    evasion_max_force = e.detail.evasion_max_force;
    updateVehicles(evasion_max_speed, evasion_max_force);
  });
  bus.register("ControASAsep", e => {
    evasion_prediction = e.detail.evasion_prediction;
    vehicles[0]._strategy.predictionMax(evasion_prediction);
  });
  bus.register("ControASAsets", e => {
    evasion_target_speed = e.detail.evasion_target_speed;
    targets[0].udpateMaxSpeed(evasion_target_speed);
  });

  bus.register("ControASAswms", e => {
    wander_max_speed = e.detail.wander_max_speed;
    updateVehicles(wander_max_speed, wander_max_force);
  });
  bus.register("ControASAswmf", e => {
    wander_max_force = e.detail.wander_max_force;
    updateVehicles(wander_max_speed, wander_max_force);
  });
  bus.register("ControASAswac", e => {
    wander_angle_change = e.detail.wander_angle_change;
    vehicles[0]._strategy.wanderAngleChange(wander_angle_change/100);
  });
  bus.register("ControASAswr", e => {
    wander_radius = e.detail.wander_radius;
    vehicles[0]._strategy.wanderRadius(wander_radius);
  });
  bus.register("ControASAswd", e => {
    wander_distance = e.detail.wander_distance;
    vehicles[0]._strategy.wanderDistance(wander_distance);
  });

  bus.register("ControASAsams", e => {
    arrival_max_speed = e.detail.arrival_max_speed;
    updateVehicles(arrival_max_speed, arrival_max_force);
  });
  bus.register("ControASAsamf", e => {
    arrival_max_force = e.detail.arrival_max_force;
    updateVehicles(arrival_max_speed, arrival_max_force);
  });
  bus.register("ControASAsasd", e => {
    arrival_slow_radius = e.detail.arrival_slow_radius;
    vehicles[0]._strategy.slowRadius(arrival_slow_radius);
  });
  
  bus.register("ControASAsopms", e => {
    offset_pursuit_max_speed = e.detail.offset_pursuit_max_speed;
    updateVehicles(offset_pursuit_max_speed, offset_pursuit_max_force);
  });
  bus.register("ControASAsopmf", e => {
    offset_pursuit_max_force = e.detail.offset_pursuit_max_force;
    updateVehicles(offset_pursuit_max_speed, offset_pursuit_max_force);
  });
  bus.register("ControASAsopts", e => {
    offset_pursuit_target_speed = e.detail.offset_pursuit_target_speed;
    targets[0].udpateMaxSpeed(offset_pursuit_target_speed);
  });
  bus.register("ControASAsopo", e => {
    offset_pursuit_offset = e.detail.offset_pursuit_offset;
    vehicles[0]._strategy.updateOffsetRadius(offset_pursuit_offset);
  });

  bus.register("ControASAsoams", e => {
    obstacle_avoidance_max_speed = e.detail.obstacle_avoidance_max_speed;
    updateVehicles(obstacle_avoidance_max_speed, obstacle_avoidance_max_force);
  });
  bus.register("ControASAsoamf", e => {
    obstacle_avoidance_max_force = e.detail.obstacle_avoidance_max_force;
    updateVehicles(obstacle_avoidance_max_speed, obstacle_avoidance_max_force);
  });
  bus.register("ControASAsoaa", e => {
    obstacle_avoidance_ahead = e.detail.obstacle_avoidance_ahead;
    vehicles[0]._strategy.lookAhead(obstacle_avoidance_ahead);
  });

  bus.register("ControASAscms", e => {
    containment_max_speed = e.detail.containment_max_speed;
    updateVehicles(containment_max_speed, containment_max_force);
  });
  bus.register("ControASAscmf", e => {
    containment_max_force = e.detail.containment_max_force;
    updateVehicles(containment_max_speed, containment_max_force);
  });
  bus.register("ControASAsca", e => {
    containment_ahead = e.detail.containment_ahead;
    vehicles[0]._strategy.lookAhead(containment_ahead);
  });
  
  bus.register("ControASAswfms", e => {
    wall_following_max_speed = e.detail.wall_following_max_speed;
    updateVehicles(wall_following_max_speed, wall_following_max_force);
  });
  bus.register("ControASAswfmf", e => {
    wall_following_max_force = e.detail.wall_following_max_force;
    updateVehicles(wall_following_max_speed, wall_following_max_force);
  });
  bus.register("ControASAswfa", e => {
    wall_following_ahead = e.detail.wall_following_ahead;
    vehicles[0]._strategy.lookAhead(wall_following_ahead);
  });
  bus.register("ControASAswfo", e => {
    wall_following_offset = e.detail.wall_following_offset;
    vehicles[0]._strategy.offset(wall_following_offset);
  });
  
  bus.register("ControASAspfms", e => {
    path_following_max_speed = e.detail.path_following_max_speed;
    updateVehicles(path_following_max_speed, path_following_max_force);
  });
  bus.register("ControASAspfmf", e => {
    path_following_max_force = e.detail.path_following_max_force;
    updateVehicles(path_following_max_speed, path_following_max_force);
  });
  bus.register("ControASAspfa", e => {
    path_following_ahead = e.detail.path_following_ahead;
    vehicles[0]._strategy.lookAhead(path_following_ahead);
  });
  bus.register("ControASAspfr", e => {
    path_following_radio = e.detail.path_following_radio;
    init();
  });
  
  bus.register("ControASAsffms", e => {
    flow_field_max_speed = e.detail.flow_field_max_speed;
    updateVehicles(flow_field_max_speed, flow_field_max_force);
  });
  bus.register("ControASAsffmf", e => {
    flow_field_max_force = e.detail.flow_field_max_force;
    updateVehicles(flow_field_max_speed, flow_field_max_force);
  });
  bus.register("ControASAsffa", e => {
    flow_field_ahead = e.detail.flow_field_ahead;
    vehicles[0]._strategy.lookAhead(flow_field_ahead);
  });
  bus.register("ControASAcffr", e => {
    flow_field_radio = e.detail.flow_field_radio;
    init();
  });
  
  bus.register("ControASAscpfms", e => {
    crowd_path_following_max_speed = e.detail.crowd_path_following_max_speed;
    updateVehicles(crowd_path_following_max_speed, crowd_path_following_max_force);
  });
  bus.register("ControASAscpfmf", e => {
    crowd_path_following_max_force = e.detail.crowd_path_following_max_force;
    updateVehicles(crowd_path_following_max_speed, crowd_path_following_max_force);
  });
  bus.register("ControASAscpfa", e => {
    crowd_path_following_ahead = e.detail.crowd_path_following_ahead;
    vehicles[0]._strategy.lookAhead(crowd_path_following_ahead);
  });
  
  bus.register("ControASAsucams", e => {
    collision_avoidance_max_speed = e.detail.collision_avoidance_max_speed;
    updateVehicles(collision_avoidance_max_speed, collision_avoidance_max_force);
  });
  bus.register("ControASAsucamf", e => {
    collision_avoidance_max_force = e.detail.collision_avoidance_max_force;
    updateVehicles(collision_avoidance_max_speed, collision_avoidance_max_force);
  });
  bus.register("ControASAsucaa", e => {
    collision_avoidance_ahead = e.detail.collision_avoidance_ahead;
    vehicles[0]._strategy.lookAhead(collision_avoidance_ahead);
  });
  
  bus.register("ControASAsqms", e => {
    queuing_max_speed = e.detail.queuing_max_speed;
    updateVehicles(queuing_max_speed, queuing_max_force);
  });
  bus.register("ControASAsqmf", e => {
    queuing_max_force = e.detail.queuing_max_force;
    updateVehicles(queuing_max_speed, queuing_max_force);
  });
  bus.register("ControASAsqa", e => {
    queuing_ahead = e.detail.queuing_ahead;
    vehicles[0]._strategy.lookAhead(queuing_ahead);
  });
  
  bus.register("ControASAslflms", e => {
    leader_max_speed = e.detail.leader_max_speed;
    vehicles[0].maxSpeed = leader_max_speed;
  });
  bus.register("ControASAslflmf", e => {
    leader_max_force = e.detail.leader_max_force;
    vehicles[0].maxForce = leader_max_force/100;
  });
  bus.register("ControASAslfld", e => {
    leader_distance = e.detail.leader_distance;
    vehicles[0]._strategy.wanderDistance(leader_distance);
  });
  bus.register("ControASAslffms", e => {
    follower_max_speed = e.detail.follower_max_speed;
    updateVehicles(follower_max_speed, follower_max_force);
    vehicles[0].maxSpeed = leader_max_speed;
    vehicles[0].maxForce = leader_max_force/100;
  });
  bus.register("ControASAslffmf", e => {
    follower_max_force = e.detail.follower_max_force;
    updateVehicles(follower_max_speed, follower_max_force);
    vehicles[0].maxSpeed = leader_max_speed;
    vehicles[0].maxForce = leader_max_force/100;
  });
  
  bus.register("ControASAsflms", e => {
    flocking_max_speed = e.detail.flocking_max_speed;
    updateVehicles(flocking_max_speed, flocking_max_force);
  });
  bus.register("ControASAsflmf", e => {
    flocking_max_force = e.detail.flocking_max_force;
    updateVehicles(flocking_max_speed, flocking_max_force);
  });
}

function setData(d) {
  choice_main = d.choice_main;
  choice_simple = d.choice_simple;
  choice_combined = d.choice_combined;

  seek_max_speed = d.seek_max_speed;
  seek_max_force = d.seek_max_force;

  flee_max_speed = d.flee_max_speed;
  flee_max_force = d.flee_max_force;

  pursue_max_speed = d.pursue_max_speed;
  pursue_max_force = d.pursue_max_force;
  pursue_prediction = d.pursue_prediction;
  pursue_target_speed = d.pursue_target_speed;

  evasion_max_speed = d.evasion_max_speed;
  evasion_max_force = d.evasion_max_force;
  evasion_prediction = d.evasion_prediction;
  evasion_target_speed = d.evasion_target_speed;

  wander_max_speed = d.wander_max_speed;
  wander_max_force = d.wander_max_force;
  wander_angle_change = d.wander_angle_change;
  wander_radius = d.wander_radius;
  wander_distance = d.wander_distance;

  arrival_max_speed = d.arrival_max_speed;
  arrival_max_force = d.arrival_max_force;
  arrival_slow_radius = d.arrival_slow_radius;

  offset_pursuit_max_speed = d.offset_pursuit_max_speed;
  offset_pursuit_max_force = d.offset_pursuit_max_force;
  offset_pursuit_target_speed = d.offset_pursuit_target_speed;
  offset_pursuit_offset = d.offset_pursuit_offset;

  obstacle_avoidance_max_speed = d.obstacle_avoidance_max_speed;
  obstacle_avoidance_max_force = d.obstacle_avoidance_max_force;
  obstacle_avoidance_ahead = d.obstacle_avoidance_ahead;

  containment_max_speed = d.containment_max_speed;
  containment_max_force = d.containment_max_force;
  containment_ahead = d.containment_ahead;

  wall_following_max_speed = d.wall_following_max_speed;
  wall_following_max_force = d.wall_following_max_force;
  wall_following_ahead = d.wall_following_ahead;
  wall_following_offset = d.wall_following_offset;

  path_following_max_speed = d.path_following_max_speed;
  path_following_max_force = d.path_following_max_force;
  path_following_ahead = d.path_following_ahead;
  path_following_radio = d.path_following_radio;
  
  flow_field_max_speed = d.flow_field_max_speed;
  flow_field_max_force = d.flow_field_max_force;
  flow_field_ahead = d.flow_field_ahead;
  flow_field_radio = d.flow_field_radio;

  crowd_path_following_max_speed = d.crowd_path_following_max_speed;
  crowd_path_following_max_force = d.crowd_path_following_max_force;
  crowd_path_following_ahead = d.crowd_path_following_ahead;

  collision_avoidance_max_speed = d.collision_avoidance_max_speed;
  collision_avoidance_max_force = d.collision_avoidance_max_force;
  collision_avoidance_ahead = d.collision_avoidance_ahead;

  queuing_max_speed = d.queuing_max_speed;
  queuing_max_force = d.queuing_max_force;
  queuing_ahead = d.queuing_ahead;

  leader_max_speed = d.leader_max_speed;
  leader_max_force = d.leader_max_force;
  leader_distance = d.leader_distance;
  follower_max_speed = d.follower_max_speed;
  follower_max_force = d.follower_max_force;

  flocking_max_speed = d.flocking_max_speed;
  flocking_max_force = d.flocking_max_force;
}
