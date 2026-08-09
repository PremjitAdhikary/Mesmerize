class ParallelGeneticAlgorithm {

  constructor(start, target, obstacles, populationSize, lifespan, subPopulations) {
    this._gas = Array.from({ length: subPopulations }, (_) => new GeneticAlgorithm(start, target, obstacles, populationSize/subPopulations, lifespan));
    this._populationSize = populationSize;
  }

  configureRun(config) {
    this._algoSpeed = config.speed;
    this._gas.forEach(ga => {
      ga._mutation = config.mutation/100;
      ga._elitism = config.elitism/100;
    });
    this._runGenerations = config.runGenerations;
    this._callbackAfterGenRun = config.callbackAfterGenRun;
  }

  run() {
    if (this._runGenerations == 0) {
      for (let i=0; i<this._algoSpeed; i++)
        this._gas.forEach(ga => ga.runBySpeed());
    } else {
      this._gas.forEach(ga => {
        ga.runAndCompleteGeneration();
        ga.spawnNextGeneration();
      });
      this._runGenerations--;
      if (this._runGenerations == 0) this._callbackAfterGenRun();
    }
  }

  render() {
    this._gas.forEach(ga => ga._generation.forEach(b => b.showPathTaken()));
    this._gas.forEach(ga => ga._generation.forEach(b => b.show()));
  }

  preRender() {
    image(bgBuffer, 0, 0);
    image(bgBuffer2, 0, 0);
  }

  postRender() {
    this.renderFasterPath();
    this.renderStats();
  }

  renderFasterPath() {
    let ga = this.subpopulationWithFastestPath();
    if (ga == null) return;
    stroke(255);
    strokeWeight(2);
    beginShape();
    ga._fastestPath.forEach(v => vertex(v.x, v.y));
    endShape();
  }

  renderStats() {
    stroke(SketchColor.greenyellow().stringify());
    strokeWeight(1);
    let ordinalated = n => (n%100 > 10 && n%100 < 20) ? n+'th' : n+GeneticAlgorithm.ORDINAL_INDICATORS[n%10];
    let textY = 375;
    textSize(10);
    text('Current Generation: ' + ordinalated(this._gas[0]._iteration), 10, textY);
    text('Population: ' + this._populationSize, 10, textY+15);
    text('Subpopulations: ' + this._gas.length, 10, textY+30);
    if (this._gas[0]._iteration > 1) {
      text('Last Generation Stats:', 10, textY+45);
      text('  On Target : ' + (Math.floor(map(this._gas.reduce((a,b) => a + b._lastGenReachedTargetCount, 0), 0, this._populationSize, 0, 100))) + '%', 10, textY+60);
      text('  Crashed   : ' + (Math.floor(map(this._gas.reduce((a,b) => a + b._lastGenCrashedCount, 0), 0, this._populationSize, 0, 100))) + '%', 10, textY+75);
    }
    let ga = this.subpopulationWithFastestPath();
    if (ga != null) 
      text('Shortest Path: ' + ga._fastestPathLength + ' (found in ' + ordinalated(ga._fastestPathGen) + ' generation)', 10, textY+90);
  }

  subpopulationWithFastestPath() {
    let f = -1, fastest = 1000;
    for (let i=0; i<this._gas.length; i++) {
      if (this._gas[i]._fastestPathLength < fastest) {
        f = i;
        fastest = this._gas[i]._fastestPathLength;
      }
    }
    return (fastest >= 1000) ? null : this._gas[f];
  }

}