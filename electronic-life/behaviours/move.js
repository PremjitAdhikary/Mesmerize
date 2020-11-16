/**
 * Enables Locomoting Actors to move around
 * 
 * Constructor:
 * - actor: 
 * - energyCost: to move you need energy
 * - moveCriteria: this is different for different actors and worlds
 */
class Move extends Behaviour {
  
  constructor(actor, energyCost, moveCriteria) {
    super(moveCriteria);
    this._actor = actor;
    this._cost = energyCost;
  }

  /**
   * The criteria fill ups this._actor._foundLocations with eligible locaitons to move. Here the 
   * selectedLocation is picked based on the following condition:
   *  - Don't go back to the point where you came from unless that's the onle option
   * Then the selectedLocation is fed to the actor to move to.
   * Till the time the actor is moving towards the target location, it's state is set to IS_MOVING. 
   * Once it reaches, it resets state and action
   */
  executeBehaviour() {
    this._actor._energy -= this._cost;
    this._actor.setState(Move.IS_MOVING);
    let selectedLocation = (this._actor._foundLocations.length == 1 ? 
      this._actor._foundLocations[0] : 
      random(
        this._actor._foundLocations
          .filter(v => !(v.x == this._actor._prevR && v.y == this._actor._prevC))));
    let actual = this._actor._world
      .convertCoordinateToPixel(selectedLocation.x, selectedLocation.y);
    this._actor.setAction( () => {
      if (this._actor.onLocation(actual)) {
        this.resetActorBehaviour(this._actor);
      }
      this._actor.moveTo(actual);
    } );
    return true;
  }
}

Move.IS_MOVING = "is-moving";