/**
 * This is like a penalty for the actor for not doing anything
 */
class Upkeep extends Behaviour {
  
  constructor(actor, upkeepCost) {
    super(() => true);
    this._actor = actor;
    this._upkeepCost = upkeepCost;
  }

  executeBehaviour() {
    this._actor._energy -= this._upkeepCost;
    return true;
  }
  
}