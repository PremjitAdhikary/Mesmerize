/**
 * Behaviours add to the personality of the actors. It is based on these behaviours that the 
 * actor acts on the simulated world.
 * Every turn (here its a day) the actor, if not busy, gets to select a behaviour from its list 
 * of available behaviours and behaves accordingly. The execution of the behaviour is dependent 
 * on the applied criteria being fulfilled
 * 
 * Constructor:
 * - criteria: decides whether the behaviour will be acted upon or not
 * 
 * Other Methods:
 * - behave(): to execute or not to execute that is the criteria
 * - executeBehaviour(): self explanatory
 */
class Behaviour {
  constructor(criteria) {
    this._criteria = criteria;
  }

  behave() {
    if (!this._criteria()) 
      return false;
    return this.executeBehaviour();
  }

  // override this in sub classes
  executeBehaviour() {
    return true;
  }
  
  // common methods
  resetActorBehaviour(actor) {
    actor.resetAction();
    actor.resetState();
    actor.updateCurrentLocationOnWorld();
  }

}