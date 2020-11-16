/**
 * If energy is 0 and the actor is not already in the state of dying, kill the actor by calling the 
 * die() method.
 */
class Die extends Behaviour {

  constructor(actor) {
    super(() => actor._energy <= 0 && actor.isAlive());
    this._actor = actor;
  }

  executeBehaviour() {
    this._actor.die();
    return true;
  }

}

Die.IS_DYING = "is-dying";
Die.DEAD = "dead";