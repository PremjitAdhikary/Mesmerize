/**
 * Energizes the actor. Think free energy
 */
class Grow extends Behaviour {
  
  constructor(actor, growBy, growMax) {
    super(growCriteria(actor, growMax));
    this._actor = actor;
    this._by = growBy;
    this._max = growMax;
  }

  executeBehaviour() {
    this._actor._energy = Math.min(this._max, this._actor._energy + this._by);
    return true;
  }

}