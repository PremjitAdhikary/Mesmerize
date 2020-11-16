/**
 * Another unique behaviour for the pollinators and queen.
 * 
 * After pollinators collection is complete, or queen tour is complete, they need to go home.
 * The actor for whome this behaviour is must implement homeCoordinate()
 * 
 * Note: onReachAction is the function that will be called once the actor reaches home.
 */
class GoHome extends Behaviour {
  
  constructor(actor, energyCost, onReachAction) {
    super(andCriteria(
      actorHasEnergy(actor, energyCost),
      () => !actor.atHome()
    ));
    this._actor = actor;
    this._cost = energyCost;
    this._onReachAction = onReachAction;
  }

  executeBehaviour() {
    this._actor._energy -= this._cost;
    this._actor.setState(GoHome._IS_HOMING);
    let actual = this._actor.homeCoordinate();
    this._actor.setAction( () => {
      if (this._actor.onLocation(actual)) {
        this.resetActorBehaviour(this._actor);
        if (this._onReachAction)
          this._onReachAction();
      }
      this._actor.moveTo(actual);
    } );
    return true;
  }

}

GoHome._IS_HOMING = "is-homing";