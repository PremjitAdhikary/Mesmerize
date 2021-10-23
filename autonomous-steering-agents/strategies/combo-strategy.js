/**
 * When multiple strategies needs to be applied to a vehicle to steer in a certain manner
 * 
 * addStrategy(strategy, name, weight) adds a strategy to the vehicle 
 *   optionally takes a name to get it with
 *   optionally with a weight to be applied to calculate the resultant force
 * 
 * getStrategy(name)
 */
class ComboStrategy {

  constructor() {
    this._strategies = [];
  }

  addStrategy(strategy, name = "default", weight = 1) {
    this._strategies.push({
      strategy, name, weight
    });
    return this;
  }

  getStrategy(name = "default") {
    return this._strategies.find(s => s.name == name).strategy;
  }

  run(vehicle) {
    let force = this._strategies
      .reduce((total, next) => 
        total.add(next.strategy.run(vehicle).mult(next.weight)), createVector(0, 0))
      .limit(vehicle.maxForce);
    return force;
  }

}