/**
 * Unique Behaviour for the Queen for reproduction. Unlike fishes and worms from the previous 
 * worlds, pollinators cannot breed. They can only be given birth by thier queen.
 * 
 * The number of offsprings a Queen can give birth to is dependent on the Hive capacity. This is 
 * taken care in the criteria.
 */
class HiveReproduce extends Behaviour {

  constructor(actor, energyCost, energyRequired, chance) {
    super(hiveReproduceCriteria(actor, energyRequired, chance));
    this._actor = actor;
    this._cost = energyCost;
  }

  executeBehaviour() {
    this._actor._energy -= this._cost;
    this._actor._foundLocations = [];
    this._actor._foundLocations.push(createVector(0,0));
    let offspring = this._actor.createOffspring();
    this._actor._hive.addPollinator(offspring);
    return true;
  }

}