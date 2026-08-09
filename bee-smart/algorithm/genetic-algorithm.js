class GeneticAlgorithm {

  constructor(start, target, obstacles, populationSize, lifespan) {
    this._start = start;
    this._target = target;
    this._obstacles = obstacles;
    this._populationSize = populationSize;
    this._lifespan = lifespan;
    this._iteration = 1;
    this._moves = 0;
    this._generation = Array.from({ length: this._populationSize }, (_) => new Bee(this._start, new DNA(DNA.generateGenes(this._lifespan))));
    this._maxDistFromTarget = max(dist(-10, -10, this._target._x, this._target._y), dist(width+10, height+10, this._target._x, this._target._y));
    this._generationalPaths = [];

    this._lastGenReachedTargetCount = 0;
    this._lastGenCrashedCount = 0;
    this._lastGenEscapedCount = 0;
    this._mostFitGen = 0;
    this._mostFitGenReachedTargetCount = 0;
    this._fastestPathLength = 1000;
    this._fastestPathGen = 0;
    this._fastestPath;

    this._onTargetPathColor = (new SketchColor(93, 70, 128)).stringify();
    this._notOnTargetPathColor = (new SketchColor(72, 69, 77)).stringify();
    bgBuffer.clear();
    bgBuffer2.clear();
  }

  configureRun(config) {
    this._algoSpeed = config.speed;
    this._mutation = config.mutation/100;
    this._elitism = config.elitism/100;
    this._runGenerations = config.runGenerations;
    this._callbackAfterGenRun = config.callbackAfterGenRun;
  }

  run() {
    if (this._runGenerations == 0) {
      for (let i=0; i<this._algoSpeed; i++) this.runBySpeed();
    } else {
      this.runAndCompleteGeneration();
      this.spawnNextGeneration();
      this._runGenerations--;
      if (this._runGenerations == 0) this._callbackAfterGenRun();
    }
  }

  runBySpeed() {
    this._generation.filter(b => b._active).forEach(b => this.playBeeTurn(b));
    this._moves++;
    if (this._moves > this._lifespan || this._generation.every(b => !b._active)) this.spawnNextGeneration();
  }

  runAndCompleteGeneration() {
    this._generation.forEach(b => {
      while (b._active && b._moves < this._lifespan) {
        this.playBeeTurn(b);
      }
    });
  }

  playBeeTurn(b) {
    b.fly();
    if (this._target.isHit(b)) b.reachedTarget();
    this._obstacles.forEach(o => {
      if (o.isHit(b)) b.hasCrashed();
    });
  }

  // Next set of functions have Core algorithm logic
  spawnNextGeneration() {
    // store current generation 
    this._generationalPaths.push({
      onTargetPaths: this._generation.filter(b => b._targetReached).map(b => b._path), 
      notOnTargetPaths: this._generation.filter(b => !b._targetReached).map(b => b._path)
    });
    this.updateBGBuffer();
    this._generation.forEach(b => b._active = false);
    // logic for new gen
    this.calculateGenerationFitness();
    this.rankGeneration();
    let matingPool = this.generateMatingPool();
    let newGen = this.selection(matingPool);
    this._moves = 0;
    this._iteration++;
    this._generation = newGen;
  }

  calculateGenerationFitness() {
    let calculateBeeFitness = bee => {
      let d = dist(bee.x, bee.y, this._target._x, this._target._y);
      bee._fitness = map(d, 0, this._maxDistFromTarget, this._maxDistFromTarget, 0);
      if (bee._targetReached) bee._fitness *= 10;
      if (bee._escaped) bee._fitness /= 5;
      if (bee._crashed) bee._fitness /= 10;
    };
    this._generation.forEach(b => calculateBeeFitness(b));
    this.updateStats();
  }

  rankGeneration() {
    let beesOnTarget = this._generation.filter(b => b._targetReached);
    let maxMovesToTarget = beesOnTarget.reduce((a,b) => max(a, b._moves), 0) + 1;
    let minMovesToTarget = beesOnTarget.reduce((a,b) => min(a, b._moves), 500);
    beesOnTarget.forEach(b => b._fitness *= map(b._moves, minMovesToTarget, maxMovesToTarget, 1.2, 1));
    let maxFit = this._generation.reduce((a,b) => max(a, b._fitness), 0);
    this._generation.forEach(b => b._fitness /= maxFit); // Normalises fitnesses
    this._generation.sort((a, b) => b._fitness - a._fitness); // Rank population
  }

  generateMatingPool() {
    let sumFitness = this._generation.reduce((a,b) => a + b._fitness, 0);
    let prob = this._generation.map(b => b._fitness/sumFitness);
    let pickOne = () => { // Fitness Proportionate Selection
      let index = 0;
      let r = random(1);
      while (r > 0) 
        r = r - prob[index++];
      return this._generation[--index];
    };
    return Array.from({ length: this._populationSize }, (_) => pickOne()._dna);
  }

  selection(matingPool) {
    let children = [];
    let elitesCount = this._populationSize * this._elitism;
    for (let i=0; i<elitesCount; i++) 
      children.push(new Bee(this._start, this._generation[i]._dna));
    for (let i=0; i<this._populationSize - elitesCount; i++) {
      let parentA = random(matingPool);
      let parentB = random(matingPool);
      let childDNA = parentA.crossover(parentB);
      childDNA.mutate(this._mutation);
      children.push(new Bee(this._start, childDNA));
    }
    return children;
  }

  updateStats() {
    this._lastGenReachedTargetCount = this._generation.filter(b => b._targetReached).length;
    this._lastGenCrashedCount = this._generation.filter(b => b._crashed).length;
    this._lastGenEscapedCount = this._generation.filter(b => b._escaped).length;
    if (this._lastGenReachedTargetCount > this._mostFitGenReachedTargetCount) {
      this._mostFitGenReachedTargetCount = this._lastGenReachedTargetCount;
      this._mostFitGen = this._iteration;
    }
    let fastestPathLen = this._generation.filter(b => b._targetReached).reduce((a,b) => min(a, b._moves), 1000);
    if (fastestPathLen < 1000 && this._fastestPathLength > fastestPathLen) {
      this._fastestPathLength = fastestPathLen;
      this._fastestPathGen = this._iteration;
      this._fastestPath = this._generation.filter(b => b._targetReached && fastestPathLen == b._moves)[0]._path;
    }
  }

  // Next set of functions have Rendering logic
  updateBGBuffer() {
    let drawPath = (p, bg) => {
      bg.beginShape();
      p.forEach(v => bg.vertex(v.x, v.y));
      bg.endShape();
    };
    bgBuffer.strokeWeight(1);
    bgBuffer.noFill();
    bgBuffer.stroke(this._notOnTargetPathColor);
    this._generationalPaths[this._generationalPaths.length-1].notOnTargetPaths.forEach(p => drawPath(p, bgBuffer));
    bgBuffer2.strokeWeight(1);
    bgBuffer2.noFill();
    bgBuffer2.stroke(this._onTargetPathColor);
    this._generationalPaths[this._generationalPaths.length-1].onTargetPaths.forEach(p => drawPath(p, bgBuffer2));
  }

  render() {
    this._generation.forEach(b => b.showPathTaken());
    this._generation.forEach(b => b.show());
  }

  preRender() {
    this.renderPastGenerationPaths();
  }

  renderPastGenerationPaths() {
    image(bgBuffer, 0, 0);
    image(bgBuffer2, 0, 0);
  }

  postRender() {
    this.renderFasterPath();
    this.renderStats();
  }

  renderFasterPath() {
    if (this._fastestPathLength >= 1000) return;
    stroke(255);
    strokeWeight(2);
    beginShape();
    this._fastestPath.forEach(v => vertex(v.x, v.y));
    endShape();
  }

  renderStats() {
    stroke(SketchColor.greenyellow().stringify());
    strokeWeight(1);
    let ordinalated = n => (n%100 > 10 && n%100 < 20) ? n+'th' : n+GeneticAlgorithm.ORDINAL_INDICATORS[n%10];
    let textY = 375;
    textSize(10);
    text('Current Generation: ' + ordinalated(this._iteration), 10, textY);
    text('Population: ' + this._populationSize, 10, textY+15);
    if (this._iteration > 1) {
      text('Last Generation Stats:', 10, textY+30);
      text('  On Target : ' + (Math.floor(map(this._lastGenReachedTargetCount, 0, this._populationSize, 0, 100))) + '%', 10, textY+45);
      text('  Crashed   : ' + (Math.floor(map(this._lastGenCrashedCount, 0, this._populationSize, 0, 100))) + '%', 10, textY+60);
    }
    if (this._mostFitGen > 1) 
      text('Most Successful Generation Yet: ' + ordinalated(this._mostFitGen) + ' (' 
      + (Math.floor(map(this._mostFitGenReachedTargetCount, 0, this._populationSize, 0, 100))) + '% on Target)', 10, textY+75);
    if (this._fastestPathLength < 1000) 
      text('Shortest Path: ' + this._fastestPathLength + ' (found in ' + ordinalated(this._fastestPathGen) + ' generation)', 10, textY+90);
  }

}

GeneticAlgorithm.ORDINAL_INDICATORS = ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th'];