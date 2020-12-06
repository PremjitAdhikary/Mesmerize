/**
 * This is like magic.
 * 
 * Steps are:
 * 1) Initiaize population
 * 2) Calculate Fitness and Rank Population
 * 3) Create a Mating Pool with elites and Fitness Proportionate Selection
 * 4) Crossover and Mutate to generate a new Population
 * 5) Repeat from 2 - 5 till done
 */
class GeneticAlgorithm extends BaseAlgo {

  constructor(param) {
    super(param, 1);
    this._population;

    this._populationSize = this._param.cities.length * (this._param.cities.length);
    this._totalGenerations = this._param.cities.length * 2;
    this._currentGeneration = 0;
    
    this._bestTotal = Number.MAX_VALUE;
    this._bestFoundInGen = -1;

    // chance for mutation to occur for a particular vertex in path
    this._mutationProbability = 0.01;
    // if child is not better that y% of the worst from last generation, rejected
    this._cutoffRate = 0.97;
    // top x% of the current population is to be taken to the next
    this._elitism = 0.05; 
    
    this.generatePopulation();

    this._lastGenerationStatsMessage = '';
    this.resetIndices();
  }

  /**
   * Generates the initial population with random paths
   */
  generatePopulation() {
    this._population = [];
    let firstDna = new DNA(
      [...Array(cities.length).keys()], this._param.cities, this._mutationProbability);
    firstDna._dist = this.calculateCurrentTotal(firstDna._order)
    this._population.push(firstDna);
    for (let i = 1; i < this._populationSize; i++) {
      let dna = DNA.create(this._param.cities, this._mutationProbability);
      dna._dist = this.calculateCurrentTotal(dna._order);
      this._population.push(dna);
    }
  }

  resetIndices() {
    this._currentPopulationIndex = 0;
    this._currentMin = Number.MAX_VALUE;
    this._currentMax = 0;
  }

  calulateNextRoute() {
    if (this._currentGeneration >= this._totalGenerations) {
      this._calculated = true;
      return;
    }
    if (this._currentPopulationIndex >= this._populationSize) {
      this._lastGenerationStatsMessage = 'Last Generation Range: [ ' + this._currentMin.toFixed(1) 
        + ' - ' + this._currentMax.toFixed(1) + ' ]';
      this.generateNextPopulation();
      this.resetIndices();
      return;
    }
    this.updateMessage();
    this.drawCurrentRoute();
    this._currentPopulationIndex++;
  }

  generateNextPopulation() {
    this.normalizePopulationFitness();
    this.rankPopulation();
    let matingPool = this.generateMatingPool();

    let newPopulation = this.breed(matingPool);
    this._population = newPopulation;
    this._currentGeneration++;
  }

  /**
   * The fitness for every dna is inversely proportional to the dist of the path
   * The fitness is normalized so that sum of all fitness in the population is 1
   */
  normalizePopulationFitness() {
    this._population.forEach( dna => dna._fitness = 1 / (dna._dist + 1) );
    let fitnessSum = this._population.reduce((a,b) => a + b._fitness, 0);
    this._population.forEach( dna => dna._fitness /= fitnessSum );
  }

  rankPopulation() {
    this._population.sort( (a,b) => b._fitness - a._fitness );
  }

  /**
   * Select elites from current generation as parents.
   * Fitness Proportionate Selection is used (thanks to normalized fitness) to select the rest 
   * of the parents
   */
  generateMatingPool() {
    let matingPool = [];
    for (let i=0; i < this._populationSize * this._elitism; i++) 
      matingPool.push(this._population[i]);

    let cumulativeFitness = [];
    cumulativeFitness.push(this._population[0]._fitness);
    for (let i=1; i<this._population.length; i++) 
      cumulativeFitness.push(this._population[i]._fitness + cumulativeFitness[i-1]);
    cumulativeFitness.reverse();

    for (let i=0; i < this._populationSize - (this._populationSize * this._elitism) - 1; i++) {
      let probability = random(1);
      for (let f=cumulativeFitness.length-1; f>=0; f--) 
        if (probability <= cumulativeFitness[f]) {
          matingPool.push(this._population[f]);
          break;
        }
    }
    return matingPool;
  }

  /**
   * Add elites to the next generation.
   * 
   * Select 2 parents at random and breed them to come up with the child for the next 
   * generation. The child maybe rejected if it is worse than the worst of the last 
   * generation by a certain percentage (this is where cutoffRate comes in).
   */
  breed(matingPool) {
    let children = [];
    for (let i=0; i < this._populationSize * this._elitism; i++) 
      children.push(matingPool[i]);

    for (let i=0; i < this._populationSize - (this._populationSize * this._elitism); ) {
      let dnaA = floor(random(matingPool.length));
      let dnaB = floor(random(matingPool.length));
      let dna = this.crossOver(this._population[dnaA], this._population[dnaB]);
      if (this._currentMin >= this._currentMax * this._cutoffRate 
        || dna._dist < this._currentMax * this._cutoffRate) {
        children.push(dna);
        i++;
      }
    }
    return children;
  }

  /**
   * Ordered Crossover...
   * 
   *  Let dnaA = 0 1 2 3[4 5 6 7]8 9  // selected subset in []
   * 
   *  Let dnaB = 9 8 7 6 5 4 3 2 1 0  // remainder in order without duplication
   *             + + x x x x + + + +
   * 
   *  Offspring = [4 5 6 7]9 8 3 2 1 0
   * 
   * Mutation...
   * 
   *  Let original dna = 1 2 3 4 5 6
   *                       -     -   // selected genes to swap
   * 
   *  Mutated dna =      1 5 3 4 2 6
   */
  crossOver(dnaA, dnaB) {
    let start = Math.floor(random(dnaA._order.length));
    let end = Math.floor(random(start+1, dnaA._order.length));
    let newOrder = dnaA._order.slice(start, end);

    for (let i = 0; i < dnaB._order.length; i++) {
      if (!newOrder.includes(dnaB._order[i])) {
        newOrder.push(dnaB._order[i]);
      }
    }

    let dna = new DNA(newOrder, this._param.cities, this._mutationProbability);
    dna.mutate();
    dna._dist = this.calculateCurrentTotal(dna._order);
    return dna;
  }

  drawCurrentRoute() {
    let dna = this._population[this._currentPopulationIndex];
    this._currentMin = Math.min(this._currentMin, dna._dist);
    this._currentMax = Math.max(this._currentMax, dna._dist);
    this._param.testRoute = dna.getRoute();
    if (dna._dist < this._bestTotal) {
      this._bestTotal = dna._dist;
      this._param.bestRoute = [];
      this._param.testRoute.forEach(edge => this._param.bestRoute.push(edge));
      this._bestFoundInGen = this._currentGeneration;
    }
  }

  updateMessage() {
    this._param.messages = [];
    this._param.messages.push('Generation: ' 
      + (this._currentGeneration + 1) + ' / ' + this._totalGenerations);
    this._param.messages.push('Routes Tested: ' 
      + (this._currentPopulationIndex + 1) + ' / ' + this._populationSize);
    this._param.messages.push('Best found in Generation: ' + (this._bestFoundInGen + 1));
    let percentage = 
      (this._currentGeneration * this._populationSize + (this._currentPopulationIndex + 1)) 
      / (this._totalGenerations * this._populationSize) 
      * 100;
    this._param.messages.push('Completed: ' + percentage.toFixed(10) + '%');
    this._param.messages.push(this._lastGenerationStatsMessage);
    this._param.testRouteMessage = 'Test Route Total: ' 
      + this._population[this._currentPopulationIndex]._dist.toFixed(1);
    this._param.bestRouteMessage = 
      'Best Route Total: ' + (this._bestTotal == Number.MAX_VALUE ? 
        'MAX' : this._bestTotal.toFixed(1));
  }

}