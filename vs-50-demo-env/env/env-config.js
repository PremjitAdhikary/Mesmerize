class EnvConfig {}

EnvConfig.SHORT_TREES = {
  z: 1, gap: () => random(170, 180), 
  minHeight: 70, maxHeight: 90, 
  minAngle: 85, maxAangle: 125, 
  branchColor: () => (new SketchColor(211, 211, 211)).stringify(), 
  weight: 6, level: 3, maxBranches: 4, 
  leafEnclosureSize: 75, minLeaves: 50, maxLeaves: 75, 
  minLengthMult: 0.8, maxLengthMult: 0.9, 
  bgWidth: () => width * 3, 
  chanceToPlaceTreeAtGap: () => 0.6 > random(1)
};

EnvConfig.MEDIUM_TREES = {
  z: 0, gap: () => random(200, 220), 
  minHeight: 35, maxHeight: 50, 
  minAngle: 95, maxAangle: 115, 
  branchColor: () => (new SketchColor(169, 169, 169)).stringify(), 
  weight: 6, level: 4, maxBranches: 4, 
  leafEnclosureSize: 85, minLeaves: 60, maxLeaves: 80, 
  minLengthMult: 1.3, maxLengthMult: 1.4, 
  bgWidth: () => width * 3, 
  chanceToPlaceTreeAtGap: () => 0.98 > random(1)
};

EnvConfig.TALL_TREES = {
  z: 0, gap: () => random(250, 270), 
  minHeight: 70, maxHeight: 100, 
  minAngle: 95, maxAangle: 130, 
  branchColor: () => (new SketchColor(128, 128, 128)).stringify(), 
  weight: 4, level: 3, maxBranches: 3, 
  leafEnclosureSize: 95, minLeaves: 460, maxLeaves: 500, 
  minLengthMult: 1.2, maxLengthMult: 1.5, 
  bgWidth: () => width * 3, 
  chanceToPlaceTreeAtGap: () => 0.99 > random(1)
};

EnvConfig.STYLIZED_SHORT_TREES = {
  z: 1, gap: () => random(170, 180), 
  minHeight: 70, maxHeight: 90, 
  minAngle: 85, maxAangle: 125, 
  // branchColor: () => (new SketchColor(138, 115, 98)).stringify(), 
  branchColor: () => (new SketchColor(71, 60, 54)).stringify(), 
  weight: 10, level: 3, maxBranches: 4, 
  leafEnclosureSize: 75, minLeaves: 50, maxLeaves: 75, 
  leafColors: () => [
    // SketchColor.yellow().stringify(), 
    // SketchColor.greenyellow().stringify()
    (new SketchColor(121, 113, 40)).stringify(), 
    (new SketchColor(189, 215, 114)).stringify()
  ],
  minLengthMult: 0.8, maxLengthMult: 0.9, 
  bgWidth: () => width * 4, 
  chanceToPlaceTreeAtGap: () => 0.6 > random(1), 
  tint: () => SketchColor.blend(SketchColor.white(), SketchColor.white(), SketchColor.yellow()).alpha(0.15).stringify()
};

EnvConfig.STYLIZED_MEDIUM_TREES = {
  z: 0, gap: () => random(200, 220), 
  minHeight: 35, maxHeight: 50, 
  minAngle: 95, maxAangle: 115, 
  // branchColor: () => (new SketchColor(112, 94, 80)).stringify(), 
  // branchColor: () => (new SketchColor(142, 115, 98)).stringify(), 
  branchColor: () => (new SketchColor(176, 171, 87)).stringify(), 
  weight: 8, level: 4, maxBranches: 4, 
  leafEnclosureSize: 85, minLeaves: 30, maxLeaves: 40, 
  leafColors: () => [
    // (new SketchColor(133, 156, 84)).stringify(), 
    // (new SketchColor(188, 224, 110)).stringify()
    (new SketchColor(120, 130, 77)).stringify(), 
    (new SketchColor(90, 95, 63)).stringify()
  ], 
  minLengthMult: 1.3, maxLengthMult: 1.4, 
  bgWidth: () => width * 3.5, 
  chanceToPlaceTreeAtGap: () => 0.98 > random(1)
};

EnvConfig.STYLIZED_TALL_TREES = {
  z: 0, gap: () => random(50, 70), 
  minHeight: 60, maxHeight: 80, 
  minAngle: 95, maxAangle: 130, 
  // branchColor: () => (new SketchColor(133, 143, 110)).stringify(), 
  branchColor: () => (new SketchColor(148, 159, 83)).stringify(), 
  weight: 6, level: 3, maxBranches: 3, 
  leafEnclosureSize: 45, minLeaves: 10, maxLeaves: 20, 
  leafColors: () => [
    // (new SketchColor(147, 161, 116)).stringify(), 
    // (new SketchColor(176, 191, 142)).stringify()
    (new SketchColor(168, 177, 112)).stringify(), 
    (new SketchColor(133, 143, 108)).stringify()
  ], 
  minLengthMult: 1.2, maxLengthMult: 1.5, 
  bgWidth: () => width * 3, 
  chanceToPlaceTreeAtGap: () => 0.99 > random(1), 
  tint: () => SketchColor.white().alpha(0.25).stringify()
};

EnvConfig.SLIM_FOREST_SETUP = (env) => {
  env.behindGround.push(new Sky(BgEnv.GROUND_LEVEL));
  env.behindGround.push(new Forest(EnvConfig.MEDIUM_TREES, width * 0.1));
  env.ground = new Ground((new SketchColor(128, 128, 128)).stringify(), BgEnv.GROUND_LEVEL);
  env.frontOfGround.push(new Grass(SketchColor.white().stringify()));
};

EnvConfig.BW_FOREST_SETUP = (env) => {
  env.behindGround.push(new Sky(BgEnv.GROUND_LEVEL));
  env.behindGround.push(new Forest(EnvConfig.TALL_TREES, width * 2.16));
  env.behindGround.push(new Forest(EnvConfig.TALL_TREES, width * 2.79));
  env.behindGround.push(new Forest(EnvConfig.MEDIUM_TREES, width * 1.31));
  env.behindGround.push(new Forest(EnvConfig.MEDIUM_TREES, width * 0.51));
  env.behindGround.push(new Forest(EnvConfig.SHORT_TREES, width * 0.23));
  env.behindGround.push(new Forest(EnvConfig.SHORT_TREES , width * 0.35));

  env.ground = new Ground((new SketchColor(128, 128, 128)).stringify(), BgEnv.GROUND_LEVEL);
  
  env.frontOfGround.push(new Grass(SketchColor.white().stringify()));
};

EnvConfig.STYLIZED_FOREST_SETUP = (env) => {
  env.behindGround.push(new StylizedSky(BgEnv.GROUND_LEVEL, 210, 90));
  env.behindGround.push(new StylizedForest(EnvConfig.STYLIZED_TALL_TREES, width * 2.16));
  env.behindGround.push(new StylizedForest(EnvConfig.STYLIZED_TALL_TREES, width * 0.75));
  env.behindGround.push(new StylizedForest(EnvConfig.STYLIZED_MEDIUM_TREES, width * 1.31));
  env.behindGround.push(new StylizedForest(EnvConfig.STYLIZED_MEDIUM_TREES, width * 0.65));
  env.behindGround.push(new StylizedForest(EnvConfig.STYLIZED_SHORT_TREES, width * 0.73));
  env.behindGround.push(new StylizedForest(EnvConfig.STYLIZED_SHORT_TREES , width * 1.35));
  
  env.ground = new StylizedGround((new SketchColor(194, 178, 128)).stringify(), 
    (new SketchColor(148, 136, 99)).stringify(), BgEnv.GROUND_LEVEL);
  // env.ground = new StylizedGround((new SketchColor(133, 123, 118)).stringify(), 
  //   (new SketchColor(140, 144, 119)).stringify(), BgEnv.GROUND_LEVEL);

  // env.frontOfGround.push(new Grass(SketchColor.greenyellow().stringify()));
  env.frontOfGround.push(new Grass(new SketchColor(119, 125, 90).stringify()));
};