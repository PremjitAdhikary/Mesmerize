/**
 * Enables actor to reproduce based on criteria. Calls the createOffspring() method of the actor
 * 
 * Constructor:
 * - actor: 
 * - energyCost: to reprduce
 * - energyRequired: otherwise the parent will die while giving birth
 * - chance: Based on some chance percentage, the actor can reproduce
 */
class Reproduce extends Behaviour {

  constructor(actor, energyCost, energyRequired, chance) {
    super(reproduceCriteria(actor, energyRequired, chance));
    this._actor = actor;
    this._cost = energyCost;
  }

  executeBehaviour() {
    this._actor._energy -= this._cost;
    this._actor.createOffspring();
    return true;
  }

}