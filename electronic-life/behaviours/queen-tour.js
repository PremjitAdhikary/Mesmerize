/**
 * Unique behaviour for the Queen.
 * 
 * When she gers bored, ie, she is done giving birth to all the pollinators possible, when she has 
 * enough energy, she goes around for a small tour of the archipelago.
 */
class QueenTour extends Behaviour {
  
  constructor(actor, energyCost, minEnergyRequired) {
    super(andCriteria(
      actorHasEnergy(actor, minEnergyRequired),
      () => actor.atHome()
    ));
    this._actor = actor;
    this._cost = energyCost;
  }

  /**
   * A random number of random coordinates in the archipelago are selected and the queen visits 
   * them one by one.
   */
  executeBehaviour() {
    this._actor._energy -= this._cost;
    this._actor.setState(QueenTour.IS_TOURING);
    let numberOfHops = random(6,10);
    let hops = [];
    for (let h=0; h<numberOfHops; h++) 
      hops.push(this.randomLocation());
    let actual = hops.shift();
    this._actor.setAction( () => {
      if (this._actor.onLocation(actual)) {
        if (hops.length == 0) {
          this.resetActorBehaviour(this._actor);
        } else {
          actual = hops.shift();
          this._actor.updateCurrentLocationOnWorld();
        }
      }
      this._actor.moveTo(actual);
    } );
    return true;
  }

  randomLocation() {
    let margin = 50;
    return createVector(
      margin + Math.floor(random(width-(margin*2))), 
      margin + Math.floor(random(height-(margin*2))));
  }

}

QueenTour.IS_TOURING = "is-touring";